import React from 'react';
import { Button, Icon, Grid } from 'semantic-ui-react';
import { Link } from '../routes';

class NoticeInfo extends React.Component {
    render() {
        const { pdf_ref, address , status } = this.props;
        let icon1 = 'circle outline', icon2 = 'circle outline', icon3 = 'circle outline', icon4 = 'circle outline';
        if (status == 0) { icon1 = 'circle outline' }
        else if (status == 1) { icon1 = 'circle dot outline'; icon2 = 'circle' }
        else if (status == 2) { icon1 = 'circle'; icon2 = 'circle dot outline'; icon3 = 'circle outline' }
        else if (status == 3) { icon1 = 'circle'; icon2 = 'circle'; icon3 = 'circle dot outline'; icon4 = 'circle outline'}
        else { icon1 = 'circle'; icon2 = 'circle'; icon3 = 'circle'; icon4 = 'circle' }
        if (this.props.origin == 'noticeInterface') {
            return <Grid verticalAlign='middle'>
            <Grid.Row columns={1}>
            <Grid.Column>
                        Notice's reference: <a url="#">http://ipfs.io/ipfs/{this.props.ipfs}</a>
            </Grid.Column>
            </Grid.Row>

            <Grid.Row textAlign="center">
            <Grid.Column width={3}>
                <font size="+2"><strong>Stage</strong></font>
            </Grid.Column>
            <Grid.Column textAlign='center' width={2}>
                        <Icon size='huge' name={icon1} color='olive'/><br/>
                        Published
            </Grid.Column>
            <Grid.Column width={1}>
            <font size="+3">>>></font>
            </Grid.Column>
            <Grid.Column width={2}>
                        <Icon size='huge' name={icon2} color='olive' /><br/>
                        Public Session
            </Grid.Column>
            <Grid.Column width={1}>
            <font size="+3">>>></font>
            </Grid.Column>
            <Grid.Column width={2}>
                        <Icon size='huge' name={icon3} color='olive' /><br/>
                        Eminent to End
            </Grid.Column>
            <Grid.Column width={1}>
            <font size="+3">>>></font>
            </Grid.Column>
            <Grid.Column width={2}>
                        <Icon size='huge' name={icon4} color='olive' /><br/>
                        Ended
            </Grid.Column>
            </Grid.Row>
        </Grid>
        }
        return (
            <div>
                <Grid>
                    <Grid.Row columns={2}>
                    <Grid.Column>
                                Notice's reference: <a url="#">http://ipfs.io/ipfs/{this.props.ipfs}</a>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Link route={`/notices/${address}`}>
                        <Button>Show more</Button>
                        </Link>
                    </Grid.Column>
                    </Grid.Row>

                    <Grid.Row textAlign="center" columns={5}>
                    <Grid.Column>
                        <font size="+2"><strong>Stage</strong></font>
                    </Grid.Column>
                    <Grid.Column centered>
                                <Icon size='big' name={icon1} color='olive'/><br/>
                                Published
                    </Grid.Column>
                    <Grid.Column>
                                <Icon size='big' name={icon2} color='olive' /><br/>
                                Public Session
                    </Grid.Column>
                    <Grid.Column>
                                <Icon size='big' name={icon3} color='olive' /><br/>
                                Eminent to End
                    </Grid.Column>
                    <Grid.Column>
                                <Icon size='big' name={icon4} color='olive' /><br/>
                                Ended
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
         
        );
    }
}


export default NoticeInfo;