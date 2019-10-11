import React, { Component } from 'react';
import { Grid, Form, Input, Message, Button, Icon, Table } from 'semantic-ui-react';
import getNoticeAt from '../lib/getNoticeAt';
import getNoticeItemAt from '../lib/getNoticeItemAt';
import RequestNoticeItemRow from './RequestNoticeItemRow';
import web3 from '../lib/web3';
import NoticeInfo from '../components/NoticeInfo';
import localweb3 from '../lib/localweb3';
import { Router } from '../routes';

class NoticeInterfaceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notice_address: '',
            notice_items_addresses: [],
            notice_instance: null,
            rows: [],
            notice_status: '',
            message_header: '',
            message_content: '',
            message_type: '',
            blocknumber: '',
            publish_bn: '',
            open_session_bn: '',
            start_eminent_bn: '',
            end_bn: '',
            address: '', 
            pdfref: '',
            passToStatus: '',
        };
    }

    static async getInitialProps(props) {
        // console.log("props" + this.props);
    }

    async populateRows(notice_address) {
        const notice_instance = getNoticeAt(notice_address);
        const items = await notice_instance.methods.getNoticeItems().call();
        this.setState({notice_items_addresses:items});

        let response = [];
        for (const address of items) {
            const item_instance = getNoticeItemAt(address);

            const item_ref = await item_instance.methods.ref_item_notice().call();
            const item_value_ref = await item_instance.methods.ref_value().call();
            let best_offer;
            try {
                best_offer = await notice_instance.methods.getBestOfferByItemAddress(address).call();
            } catch (err) {
                best_offer = "-"
            }
            let best_bidder;
            try {
                best_bidder = await notice_instance.methods.getBestBidderByItem(address).call();
            } catch(err) {
                best_bidder = "-"
            }
            // console.log({item_ref, address, item_value_ref, best_offer, best_bidder});
            response.push({item_ref, address, item_value_ref, best_offer, best_bidder});
        }
        return response;
    }

    async componentDidMount() {
        this.setState({notice_address: this.props.notice_address});
        console.log("Loading contract at " + this.props.notice_address);
        const notice_instance = getNoticeAt(this.props.notice_address);
        const actual_blocknumber = await web3.eth.getBlockNumber();
        console.log("Contract instance "); 
        console.log(notice_instance);
        let bn = await web3.eth.getBlockNumber();
        this.setState({notice_instance});

        let i_publish_bn = await notice_instance.methods.i_publish_bn().call();

        let i_open_session_bn = await notice_instance.methods.i_open_session_bn().call();

        let i_start_eminent_bn = await notice_instance.methods.getInstanceStartEminent().call();

        let i_end_notice = await notice_instance.methods.getInstanceEndNotice().call();

        let notice_status = await notice_instance.methods.noticeStatus().call();
        let items = await notice_instance.methods.getNoticeItems().call();
        let populate_rows = await this.populateRows(this.props.notice_address)
        // console.log(populate_rows);
        this.setState({
            rows: populate_rows, 
            notice_status: notice_status,
            blocknumber: bn,
            publish_bn: i_publish_bn,
            open_session_bn: i_open_session_bn,
            start_eminent_bn: i_start_eminent_bn,
            end_bn: i_end_notice,
        });

        let notice_summary;
    
        let pdfref;
        let status = 0;
        try {
            pdfref = await notice_instance.methods.getLastNoticeInfo().call();
        } catch (err) {
            pdfref = 'Not defined'
        }
        if ((i_publish_bn <= actual_blocknumber) || (notice_status !== '0')) {
            if (notice_status == 0) { // config
                status = 0;
                } else if ((notice_status >= 1) && (notice_status < 4)) { // running
                    if ((i_publish_bn <= actual_blocknumber) && (i_open_session_bn > actual_blocknumber)) {
                        status = 1;
                    } else if ((i_open_session_bn <= actual_blocknumber) && (i_start_eminent_bn > actual_blocknumber)) {
                        status = 2;
                    } else if (i_start_eminent_bn < actual_blocknumber) {
                        status = 3;
                    }
                } else { // ended
                status = 4;
            } 
            let address = this.props.address;
            this.setState({pdfref});
            this.setState({passToStatus:status});
            notice_summary = { address, pdfref, status };
        }

        return { notice_instance, notice_status, notice_summary };
    }

    // handle updates in form (state in react isnt auto update)
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]:value
        })
    }


    loadedContract(obj) {
        for (var method in obj) {
            if (obj.hasOwnProperty(method)) {
                return true;
            }
        }
        return false;
    }


    renderRows() {
        
        // console.log("render rows" +  this.state.rows);
        return this.state.rows.map((request) => {
            return <RequestNoticeItemRow request={request} notice_address={this.state.notice_address} />
        })
        // return rows;//<RequestNoticeItemRow request={this.state.rows} />;
    }

    renderItems() {
        const { Header, Row, HeaderCell, Body } = Table;
        return(<Table>
            <Header>
              <Row>
                <HeaderCell>#</HeaderCell>
                <HeaderCell textAlign='center'>Sub-contract Address</HeaderCell>
                <HeaderCell textAlign='center'>Reference Value</HeaderCell>
                <HeaderCell textAlign='center'>Best Offer</HeaderCell>
                <HeaderCell textAlign='center'>Best Bidder</HeaderCell>
                <HeaderCell textAlign='center'>Action</HeaderCell>
              </Row>
            </Header>
              <Body>
                {this.renderRows()}
              </Body>
            </Table>);
    }

    onClickEnter = async () => {
        const notice_instance = getNoticeAt(this.props.notice_address);
        const accounts = await web3.eth.getAccounts();
        try {
            await notice_instance.methods.enterNotice().send({from: accounts[0]});
            this.setState({message_type: 'success', message_header: 'Yay!', message_content: 'You already can make an offer.'});
        } catch (err) {
            this.setState({message_type: 'error', message_header: 'Oops!', message_content: 'You can\'t enter this notice.'});
        }
    }

    onClickExit = async () => {
        const notice_instance = getNoticeAt(this.props.notice_address);
        const accounts = await web3.eth.getAccounts();
        try {
            await notice_instance.methods.exitNotice().send({from: accounts[0]});
            this.setState({message_type: 'success', message_header: 'Yay!', message_content: 'You have left the notice.'});
        } catch (err) {
            this.setState({message_type: 'error', message_header: 'Oops!', message_content: 'You can\'t leave this notice.'});
        }
    }

    onClickMail = () => {
        console.log("question");
    }

    renderButtonInteract = () => {
        return(
            <div>
                <Button icon onClick={this.onClickEnter} color='green' labelPosition='left'><Icon name='play'/>Enter Notice</Button>
                <Button icon onClick={this.onClickExit} color='orange' labelPosition='left'><Icon name='pause'/>Exit Notice</Button>
                {/* <Button icon onClick={this.onClickMail} color='blue' labelPosition='left'><Icon name='mail'/>Contact</Button> */}
            </div>
        );
    }

    renderButtons() {
        // console.log(this.state.notice_items_addresses)
        // console.log("props " + this.props.notice_status);
        // console.log("state " + this.state.notice_status);
        let pub = this.state.publish_bn;
        let open = this.state.open_session_bn;
        let bn = this.state.blocknumber;
        // console.log("pub >= bn " + pub + " <= " + bn + " && " + open + " > " + bn)
        let showButtons;
        if ((this.state.notice_status == '1') && (pub <= bn) && (open > bn)) {
            // console.log("show buttons: " + true);
            showButtons = true;
        } else {
            // console.log("show buttons: " + false);
            showButtons = false;
        }
        let msg_component;
        if (this.state.message_type == 'error') {
            msg_component = <Message error header={this.state.message_header} content={this.state.message_content} />
        } else if (this.state.message_type == 'success') {
            msg_component = <Message positive header={this.state.message_header} content={this.state.message_content} />
        } else {
            msg_component = ''
        }
        return(
            <div>
                { true && 
                this.renderButtonInteract()}
                {msg_component}
            </div>
        );
    }
    render() {
        let rendered_info;
        
        // if (this.state.owner) {
            rendered_info = <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <NoticeInfo status={this.state.notice_status} ipfs={this.state.pdfref} origin="noticeInterface" status={this.state.passToStatus} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center'>
                    <Grid.Column width={16}>
                        {this.renderButtons()}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                    {this.renderItems()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>;
        return (
                rendered_info
        )
        
    }
}

export default NoticeInterfaceForm;