import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { Router } from '../../routes';
import web3 from '../../lib/web3';
import contract from '../../lib/getNoticeFactory';
import Layout from '../../components/Layout';

class NoticeNew extends Component {
    state = {
        notice_owner: '',
        error_message: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, error_message: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods
                .addNotice(this.state.notice_owner)
                .send({from:accounts[0]});
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ error_message: err.message});
        }
        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
            <h3>Create a Notice</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.error_message}>
                <Form.Field>
                    <label>Notice Responsable Address</label>
                    <Input 
                        label="Address"
                        labelPosition="left"
                        placeholder="0x0000...."
                        value={this.state.notice_owner}
                        onChange={event => this.setState(
                            {notice_owner: event.target.value}
                        )} />
                </Form.Field>
                <Message error header="Oops!" content={this.state.error_message} />
                <Button loading={this.state.loading} primary>Create!</Button>
            </Form>
            </Layout>
        );
    }
}

export default NoticeNew;