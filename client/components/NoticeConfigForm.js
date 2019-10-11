import React, { Component } from 'react';
import { Grid, Form, Input, Message, Button, Icon } from 'semantic-ui-react';
import getNoticeAt from '../lib/getNoticeAt';
import web3 from '../lib/web3';
import { Router } from '../routes';

class NoticeConfigForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ipfs: '',
            item_number: '',
            item_ref_value: '',
            publish_bn: '',
            open_session_bn: '',
            start_eminent: '',
            owner: false,
            extension: '',
            error_message_ipfs: '',
            error_message_items: '',
            error_message_blocks: '',
            btn_message_header: '',
            btn_message_content: '',
            loading: false,
            account:'',
        };
    
        this.handleInputChange = this.handleInputChange.bind(this);
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

    static async getInitialProps(props) {
        console.log(props);
    }

    loadedContract(obj) {
        for (var method in obj) {
            if (obj.hasOwnProperty(method)) {
                return true;
            }
        }
        return false;
    }

    async componentDidMount() {
        console.log(this.props.notice);
        // using Reroute need to load contract instance again
        
        let notice;
        if (this.loadedContract(this.props.notice.methods)) {
            notice = this.props.notice;
        } else {
            notice = getNoticeAt(this.props.notice.options.address);
        }
        
        this.checkOwner();
        
        // let accs = await web3.eth.getAccounts();
        // console.log(accs);
        let _ipfs = await notice.methods.getLastNoticeInfo().call();
        let _publish_bn = await notice.methods.i_publish_bn().call();
        let _open_session_bn = await notice.methods.i_open_session_bn().call();
        let _start_eminent = await notice.methods.getInstanceStartEminent().call();
        let _extension = await notice.methods.getInstanceBlockExtension().call();
        if (_ipfs !== 'undefined') this.setState({ipfs: _ipfs});
        if (_publish_bn !== 'undefined') this.setState({publish_bn: _publish_bn});
        if (_open_session_bn !== 'undefined') this.setState({open_session_bn: _open_session_bn});
        if (_start_eminent !== 'undefined') this.setState({start_eminent: _start_eminent});
        if (_extension !=='undefined') this.setState({extension: _extension});
    }

    onSubmitIPFS = async event => {
        event.preventDefault();
        let notice_instance = this.props.notice;
        console.log(notice_instance);

        this.setState({loading: true, error_message_ipfs: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await notice_instance.methods
                .addNoticePDF(this.state.ipfs)
                .send({from: accounts[0]});
            Router.pushRoute(`/notices/${notice_instance.options.address}`);
        } catch (err) {
            this.setState({error_message_ipfs: err.message});
        }
        this.setState({loading: false});
    }

    onSubmitAddItem = async event => {
        event.preventDefault();
        let notice_instance = this.props.notice;

        this.setState({loading: true, error_message_items: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await notice_instance.methods
                .addItem(
                    this.state.item_ref_value,
                    this.state.item_number
                ).send({
                    from:accounts[0]
                });
            Router.pushRoute(`/notices/${notice_instance.options.address}`);
        } catch (err) {
            this.setState({error_message_items: err.message});
        }
        this.setState({loading: false});
    }

    onSubmitBlockNumbers = async event => {
        event.preventDefault();
        let notice_instance = this.props.notice;
        let _pub = parseInt(this.state.publish_bn);
        let _open = parseInt(this.state.open_session_bn);
        let _eminent = parseInt(this.state.start_eminent);
        // here you can define how randomly the eminent block will behavior
        // for simplicity I defined as a random integer beetween 0 and 120 (aprox 30 
        // minutes if block mining time is the same as official ethereum blockchain)
        let _end = parseInt(Math.floor(Math.random()*120));

        let _ext = parseInt(this.state.extension);
        
        console.log(_pub + ", " + _open + ", " + _eminent + ", " + _end + ", " + _ext);
        
        this.setState({loading: true, error_message_blocks: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await notice_instance.methods
                .configBlocksIntervals(_pub, _open, _eminent, _end, _ext)
                .send({from: accounts[0]});
            Router.pushRoute(`/notices/${notice_instance.options.address}`);
        } catch (err) {
            this.setState({error_message_blocks: err.message});
        }
        this.setState({loading: false});
    }

    renderBlockConfig() {
        return(
            <Form onSubmit={this.onSubmitBlockNumbers} error={!!this.state.error_message_blocks}>
                <h3>Configure the block intervals</h3>
                <Form.Field width={12}>
                    <label>Blocks to set as publish</label>
                    <Input 
                        name="publish_bn"
                        value = {this.state.publish_bn}
                        onChange={this.handleInputChange} 
                        label="#" labelPosition="left"
                        placeholder="42"
                    />
                    <label>Blocks after published to open Public Session</label>
                    <Input 
                        name="open_session_bn"
                        value = {this.state.open_session_bn}
                        onChange={this.handleInputChange} 
                        label="#" labelPosition="left"
                        placeholder="1337"
                    />
                    <label>Minimum lapse of Public Session (in blocks)</label>
                    <Input 
                        name="start_eminent"
                        value = {this.state.start_eminent}
                        onChange={this.handleInputChange} 
                        label="#" labelPosition="left"
                        placeholder="8337"
                    />
                    <label>Extra blocks per item best bid update</label>
                    <Input 
                        name="extension"
                        value = {this.state.extension}
                        onChange={this.handleInputChange} 
                        label="#" labelPosition="left"
                        placeholder="20"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.error_message_blocks} />
                <Button loading={this.state.loading} primary>Set interval configuration</Button>
                <hr/>
            </Form>
        );
    }

    renderAddItem() {
        return(
            <Form onSubmit={this.onSubmitAddItem} error={!!this.state.error_message_items}>
                <h3>Add new item from Notice</h3>
                <Form.Field>
                    <label>Item # reference</label>
                    <Input 
                        name="item_number"
                        value = {this.state.item_number}
                        onChange={this.handleInputChange} 
                        label="#" labelPosition="left"
                        placeholder="1337"
                    />
                    <label>Item reference value</label>
                    <Input 
                        name="item_ref_value"
                        value = {this.state.item_ref_value}
                        onChange={this.handleInputChange} 
                        label="ETH" labelPosition="right"
                        placeholder="42"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.error_message_items} />
                <Button loading={this.state.loading} primary>Add Item!</Button>
                <hr/>
            </Form>
            );
    }

    renderIPFS() {
        return(
            <Form onSubmit={this.onSubmitIPFS} error={!!this.state.error_message_ipfs}>
                <h3>Notice Reference</h3>
                <Form.Field>
                    <label>InterPlanetary File System reference</label>
                    <Input 
                        name="ipfs"
                        value = {this.state.ipfs}
                        onChange={this.handleInputChange} 
                        label="https://ipfs.io/ipfs/" labelPosition="left"
                        placeholder="Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.error_message_ipfs} />
                <Button loading={this.state.loading} primary>Add</Button>
                <hr/>
            </Form>
            );
    }

    onStartNotice = async () => {
        console.log("start notice");
        try {
            const accounts = await web3.eth.getAccounts();
            const notice_instance = await getNoticeAt(this.props.notice.options.address);

            await notice_instance.methods.startNotice().send({from: accounts[0]});
            this.setState({btn_message_header: 'Congratulations!', btn_message_content: 'This Notice is now set as RUNNING.'});
        } catch (err) {
            this.setState({btn_message_header: 'Oops!', btn_message_content: 'Something went wrong.'});
        }
    }

    onSuspendNotice = async () => {
        console.log("suspend notice");
        try {
            const accounts = await web3.eth.getAccounts();
            const notice_instance = await getNoticeAt(this.props.notice.options.address);

            await notice_instance.methods.suspendNotice().send({from: accounts[0]});
            this.setState({btn_message_header: 'Congratulations!', btn_message_content: 'This Notice is now SUSPENDED.'});
        } catch (err) {
            this.setState({btn_message_header: 'Oops!', btn_message_content: 'Something went wrong.'});
        }
    }

    // 4
    onCancelNotice = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const notice_instance = await getNoticeAt(this.props.notice.options.address);

            await notice_instance.methods.updateStatus(4).send({from: accounts[0]});
            this.setState({btn_message_header: 'Congratulations!', btn_message_content: 'This Notice has been CANCELED.'});
        } catch (err) {
            this.setState({btn_message_header: 'Oops!', btn_message_content: 'Something went wrong.'});
        }
    }

    renderButtons() {
        let msg_component;
        if (this.state.message_type == 'error') {
            msg_component = <Message error header={this.state.btn_message_header} content={this.state.btn_message_content} />
        } else if (this.state.message_type == 'success') {
            msg_component = <Message positive header={this.state.btn_message_header} content={this.state.btn_message_content} />
        } else {
            msg_component = ''
        }
        return(
            <div>
                <Button icon color='green' onClick={this.onStartNotice} labelPosition='left'><Icon name='play'/>Start Notice</Button>
                <Button icon color='orange' onClick={this.onSuspendNotice} labelPosition='left'><Icon name='pause'/>Suspend Notice</Button>
                <Button icon color='red' onClick={this.onCancelNotice} labelPosition='left'><Icon name='ban'/>Cancel Notice</Button>
                {msg_component}
            </div>
        );
    }

    async checkOwner() {
        const accounts = await web3.eth.getAccounts();
        const owner = await this.props.notice.methods.notice_owner().call();
        this.setState({account:accounts[0]});
        // console.log("o " + owner);
        // console.log("a " + accounts[0])
        if (accounts[0] == owner) {
            this.setState({owner: true});
        } else {
            this.setState({owner: false});
        }
        this.forceUpdate();
    }

    handleTry = () => this.forceUpdate();

    render() {
        
        let rendered_info;
        
        if (this.state.owner) {
            rendered_info = <Grid><Grid.Row>
                <Grid.Column width={16}>
                {this.renderIPFS()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    {this.renderBlockConfig()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                {this.renderAddItem()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
                <Grid.Column width={9}>
                    {this.renderButtons()}
                </Grid.Column>
            </Grid.Row>
            </Grid>;
        } else {
            rendered_info = 
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Message icon negative size='huge'>
                                <Icon name='ban' />
                                <Message.Content>
                                <Message.Header>Access denied</Message.Header>
                                <p>The selected account (<strong>{this.state.account}</strong>) isn't registered to configure this notice.</p>
                                </Message.Content>
                            </Message>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>;
            
        }
        return (
                rendered_info
        )
        
    }
}

export default NoticeConfigForm;