import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

export default props => {
    return (
        <Container>
            <Head>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"></link>
            </Head>

            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                        <Header />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                        {props.children}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}