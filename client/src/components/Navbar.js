import React from 'react';
import { getToken, clearCart, clearToken } from '../utils'
import { Box, Text,Heading, Image, Button } from 'gestalt';
import { withRouter, NavLink } from 'react-router-dom';


class Navbar extends React.Component {
    handleSignout = () => {
        
        clearToken();
        clearCart();
        
        this.props.history.push('/'); 
        

    }
    render() {

        return getToken() !==null ? <AuthNav handleSignout={this.handleSignout} /> : <UnAuthNav/>;
    }

}

const AuthNav = ({handleSignout}) => (
    <Box display="flex"
    alignItems="center"
    justifyContent="around"
    height={70}
    color="midnight"
    padding={1}
    shape={"roundedBottom"}
>
{ /* checkout  link */}
<NavLink activeClassName="active" to="/checkout">
    <Text size="xl" color="white">
        Checkout 
    </Text>

</NavLink>

{ /* title and logo */}
<NavLink activeClassName="active" exact to="/">
<Box display="flex" alignItems="center">
    <Box margin={2} height={50} width={50}>
        <Image
            alt="Brahaha"
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"

        />
    </Box>

    <Heading size="xs" color="orange">
        Brehaa
    </Heading>
</Box>
</NavLink>

 { /* Signout button */ }
<Button
 color="transparent"
 text="Sign out"
 inline
 size="md"
 onClick={handleSignout}
/>

</Box>
)


const UnAuthNav = () => (
    <Box display="flex"
        alignItems="center"
        justifyContent="around"
        height={70}
        color="midnight"
        padding={1}
        shape={"roundedBottom"}
    >
    { /* signin link */}
    <NavLink activeClassName="active" to="/signin">
        <Text size="xl" color="white">
            Sign In
        </Text>

    </NavLink>

    { /* title and logo */}
    <NavLink activeClassName="active" exact to="/">
    <Box display="flex" alignItems="center">
        <Box margin={2} height={50} width={50}>
            <Image
                alt="Brahaha"
                naturalHeight={1}
                naturalWidth={1}
                src="./icons/logo.svg"

            />
        </Box>

        <Heading size="xs" color="orange">
            Brehaa
        </Heading>
    </Box>
    </NavLink>

    <NavLink activeClassName="active" to="/signup">
        <Text size="xl" color="white">
            Sign Up
        </Text>

    </NavLink>
    </Box>
)

export default withRouter(Navbar);
