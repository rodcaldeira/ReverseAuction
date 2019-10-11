import React, { Component } from 'react';
import { Table, Button, Header, Modal, Form, Input } from 'semantic-ui-react';
import web3 from '../lib/web3';
import getNoticeAt from '../lib/getNoticeAt';
import { Router } from '../routes';


class RequestNoticeItemRow extends Component {

  state={
    bid_offer:'',
  }

  onSubmit = async () => {
    // console.log(this.props.notice_address);
    const notice = getNoticeAt(this.props.notice_address);
    const accounts = await web3.eth.getAccounts();
    let bid;
    if (this.state.bid_offer !== '') {
      bid = parseInt(this.state.bid_offer);
      try {
        await notice.methods.makeBid(
          this.props.request.address,
          bid
          )
        .send({
          from: accounts[0]
        });
        // Router.pushRoute(`/notices/${this.props.notice_address}`);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("You need to inform a value.");
    }
    // console.log("click try bid");
  };

  renderModal(props) {
    // console.log(props);
    let new_offer;
    if (props.best_offer !== '-') {
      new_offer = props.best_offer-1;
    } else {
      new_offer = props.item_value_ref-1;
    }
    return <Modal size="tiny" trigger={<Button>Make Offer</Button>}>
    <Modal.Header>New offer to item #{props.item_ref}</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <p>{props.best_offer !== '-' ? "Best offer":"Reference value in Notice"} for this item is {new_offer+1} <strong>ETH</strong></p>
        <Form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Field inline="true">
              <label>Place offer</label>
              <Input 
                  name="new_offer"
                  label="ETH" labelPosition="right"
                  onChange={event => this.setState(
                      {bid_offer: event.target.value}
                  )}
                  placeholder={new_offer}
              />
            </Form.Field>
            <Form.Field>
              <Button loading={this.state.loading} primary>Make Bid</Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>;
  }

  render() {
    const { Row, Cell } = Table;
    const { request, notice_address } = this.props;
    // console.log(notice_address);

    return (
      <Row>
        <Cell>{request.item_ref}</Cell>
        <Cell>{request.address}</Cell>
        <Cell textAlign='right'>{request.item_value_ref} <strong>ETH</strong></Cell>
        <Cell textAlign='right'>{request.best_offer} <strong>ETH</strong></Cell>
        <Cell>{request.best_bidder}</Cell>
        <Cell textAlign='right'>
          {this.renderModal(request)}
          {/* {
            request.complete ? null : (
              <ModalExample />
          // <Button color="green" basic onClick={this.ModalExample}>Make Offer</Button>
          )} */}
        </Cell>
      </Row>
    );
  }
}

export default RequestNoticeItemRow;
