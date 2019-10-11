import React from 'react';
import { Menu, Icon, Segment } from 'semantic-ui-react';
import { Link } from '../routes';
import web3 from '../lib/web3';

class Header extends React.Component {
    state = {
        blocknumber: '...'
    }

    componentDidMount() {
        this.blocknumber();
    }

    blocknumber = async () => {
        let blocknumber = await web3.eth.getBlockNumber();

        this.setState({blocknumber})
    }
    
    render () {
        return (
        
            <Menu fluid pointing secondary>
                <Menu.Item>
                <Link route="/">
                    <a className="item">Index</a>
                </Link>
                </Menu.Item>
                <Menu.Item>
                <Link route="/notices/new">
                    <a className="item">Add Notice</a>
                </Link>
                </Menu.Item>
                <Menu.Item position="right">
                <Link route="#">
                    <div>
                    <Icon size='big' name="ethereum"></Icon>Blocknumber #<font size="+2"><strong>{this.state.blocknumber}</strong></font>
                    </div>
                </Link>
                </Menu.Item>
            </Menu>
        );
    }
    
}

export default Header;