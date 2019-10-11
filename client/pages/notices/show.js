import React, { Component } from 'react';
import { Form, Button, Input, Message, Tab } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import NoticeConfigForm from '../../components/NoticeConfigForm';
import NoticeInterfaceForm from '../../components/NoticeInterfaceForm';
import getNoticeAt from '../../lib/getNoticeAt';
import getNoticeItemAt from '../../lib/getNoticeItemAt';
import web3 from '../../lib/web3';
import { Router } from '../../routes';

class NoticeShow extends Component {
    state = {
        notice_owner: '',
        error_message: '',
        loading: false,
        accounts: null
    };

    static async getInitialProps(props) {
        console.log(props.query.address);
        
        const notice = getNoticeAt(props.query.address);
        const notice_owner = await notice.methods.notice_owner().call();

        const notice_status = await notice.methods.noticeStatus().call();
        
        const actual_bn = await web3.eth.getBlockNumber();
        
        const i_publish_bn = await notice.methods.i_publish_bn().call();

        const i_open_session_bn = await notice.methods.i_open_session_bn().call();

        const i_start_eminent_bn = await notice.methods.getInstanceStartEminent().call();

        const i_end_notice = await notice.methods.getInstanceEndNotice().call();

        return { notice, notice_owner, notice_status, actual_bn, i_publish_bn ,i_open_session_bn, i_start_eminent_bn, i_end_notice }
    }

    async componentDidMount() {
        // console.log("component did mount");
        this.updateStateAccount();
        // // const actual_bn = await web3.eth.blockNumber;
        // const actual_bn = await web3.eth.getBlockNumber();
        // console.log("cdm" + this.props.actual_bn);
        
        // console.log("cdm pub " + this.props.i_publish_bn);
        // console.log("cdm open " + this.props.i_open_session_bn);
        // console.log("cdm emi " + this.props.i_start_eminent_bn);
        // console.log("cdm end " + this.props.i_end_notice);
        // console.log("accounts " + this.state.accounts);
    }

    async updateStateAccount() {
        let accounts = await web3.eth.getAccounts();
        this.setState({accounts});
    }

    async checkOwner() {
        const accounts = await web3.eth.getAccounts();
        if (accounts[0] == this.props.notice_owner) return true;
        else return false;
    }

    renderTabs() {
        let panes=[];
        panes.push({
            menuItem: 'Notice', render: () => <Tab.Pane><NoticeInterfaceForm notice_address={this.props.notice.options.address}/></Tab.Pane> 
        });
        
        if (this.checkOwner()) {
            panes.push({
                menuItem: 'Configuration', render: () => <Tab.Pane><NoticeConfigForm notice={this.props.notice}/></Tab.Pane>
            })
            
        } 
        return <Tab panes={panes} />;
    }

    render() {
        
        return (
        <Layout>
            <h3>Details of {this.props.notice.options.address}</h3>
            {this.renderTabs()}
        
        </Layout>
        );
        
    }
}

export default NoticeShow;
