import React from 'react';
import { Spinner, Modal, Container, Box, Button, Heading, Text, TextField } from 'gestalt'
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements'
import { withRouter } from 'react-router-dom'
import ToastMessage from './ToastMessage'
import { getCart, calculatePrice, clearCart, calculateAmount } from '../utils'
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);


class _CheckoutForm extends React.Component{
state = {
    cartItems: [],
    toast: false,
    toastMessage: '',
    address: '',
    postalCode: '',
    city: '',
    confirmationEmailAddress: '',
    orderProcessing: false,
    modal: false

}

    componentDidMount(){
        this.setState({cartItems: getCart()});

    }

    handleSubmitOrder = async () => {
         const { cartItems, city, address, postalCode } = this.state;
         const amount = calculateAmount(cartItems);

         // process order
         this.setState({ orderProcessing: true })
         let token;
         try {
             const response = await this.props.stripe.createToken();
             token = response.token.id;
             await strapi.createEntry('orders', {
                 amount,
                 brews: cartItems,
                 city,
                 postalCode,
                 address,
                 token
             })
             this.setState({orderProcessing: false, modal: false});
             clearCart();
             this.showToast('Your order has beed successfully submitted!', true)

         } catch (err) {
            this.setState({orderProcessing: false, modal: false});
            this.showToast('Your order has beed successfully submitted!', true)
         }
        
    }

    closeModal = () => this.setState({ modal: false})

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({ [event.target.name]: value });
    };

    handleConfirmOrder = async event => {
        event.preventDefault();
        

        if(this.isFormEmpty(this.state)){
            this.showToast('Fill in all fields');
            return;
        }

        this.setState({modal: true})

    }
    

    showToast = (toastMessage, redirect=false) => {
        this.setState({ toast: true, toastMessage})
        setTimeout(() => this.setState({ toast: false, toastMessage: ''},
            () => redirect && this.props.history.push('/')
        ), 5000);
    }

    isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
        return !address || !postalCode || !city || !confirmationEmailAddress;
    }

    render() {
        const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state
        return (
            <Container>
            <Box
                color="darkWash"
                margin={4}
                padding={4}
                shape="rounded"
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
            >
            { /* checkout form heading */ }
            
                <Heading color="midnight">
                    Checkout
                </Heading>
               {cartItems.length > 0 ? <React.Fragment>
                { /* user cart */ }
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    marginTop={2}
                    marginBottom={6}
                >

                <Text color="darkGray" italic>
                    {cartItems.length} Items  for Checkout
                </Text>
                <Box 
                    padding={2}
                >
                    {cartItems.map(item => (
                        <Box key={item._id} padding={1}>
                            <Text color="midnight">
                                {item.name} x {item.quantity} - ${item.quantity * item.price}
                            </Text>

                        </Box>
                    ))}
                </Box>
                     <Text bold> Total Amount: {calculatePrice(cartItems)}
                     
                     </Text>
                
                </Box>
                { /*Checout form */}
                <form style={{
                    display: 'inlineBlock',
                    textAlign: 'center',
                    maxWidth: 450
                    }}
                    onSubmit={this.handleConfirmOrder}

                >
                
                { /* Shipping address input */ }    
                <TextField
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Shipping address"
                    onChange={this.handleChange}
                />
                { /* Postal Code input */ }    
                <TextField
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    placeholder="postalCode"
                    onChange={this.handleChange}
                />
                { /* City input */ }    
                <TextField
                    id="city"
                    type="text"
                    name="city"
                    placeholder="City of Residence"
                    onChange={this.handleChange}
                />
                { /* Confimration Email Address input */ }    
                <TextField
                    id="confirmationEmailAddress"
                    type="email"
                    name="confirmationEmailAddress"
                    placeholder="confirmation Email"
                    onChange={this.handleChange}
                />
                { /* Credit Card Element */ }
                <CardElement id="stripe__input" onReady={input => input.focus()}

                />

                 
                <button id="stripe__button" type="submit">
                     Submit
                </button>

                </form>
                </React.Fragment> : (
                    //Default text if no items
                    <Box color="darkWash" shape="rounded" padding={4}>
                        <Heading
                            align="center" color="watermelon"
                            size="xs"
                        >   
                         Your Cart is empty!
                        </Heading>
                        <Text align="center" italic color="green">
                             Add some brews!

                        </Text>

                    </Box>
                )}
            </Box>
            { /* confirmation modal */ }
            { modal && (
                    <ConfirmationModal orderProcessing={orderProcessing} cartItems={cartItems} 
                        closeModal={this.closeModal} 
                        handleSubmitOrder={this.handleSubmitOrder}
                    />

            )}
             <ToastMessage show={toast} message={toastMessage} />

        </Container>
        )
    }
}

const ConfirmationModal = ({orderProcessing, cartItems, closeModal, handleSubmitOrder }) => (
    <Modal
        accessibilityCloseLabel="close"
        accessibilityModalLabel="Confirm Your Order"
        heading="Confirm the Order"
        onDismiss={closeModal}
        footer={
            <Box display="flex"
                marginRight={-1}
                marginLeft={-1}
                justifyContent="center"
            >
            <Box padding={1}>
                <Button
                    size="lg"
                    color="red"
                    text="Submit"
                    disabled={orderProcessing}
                    onClick={handleSubmitOrder}
                >
                
                </Button>
            </Box>
            
            <Box padding={1}>
                <Button
                    size="lg"
                    text="Cancel"
                    disabled={orderProcessing}
                    onClick={closeModal}
                >
                
                </Button>
            </Box>

            
            </Box>
        }
        role="alertdialog"
        size="sm"

    >
        { /* Order summary */ }
        {!orderProcessing && (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                padding={2}
                color="lightWash"
            >
             {cartItems.map(item => (
                 <Box key={item._id} padding={1}>
                    <Text
                        size="lg"
                        color="red"
                    >
                    
                     {item.name} x {item.quantity} - ${item.quantity * item.price}
                    </Text>

                 </Box>
             ))}
             <Box
                paddingY={2}
             >
             <Text size="lg" bold>
                Total: {calculatePrice(cartItems)}
             </Text>
             
             </Box>
            
            </Box>
        )}

        { /* Order Processing Spinner */ }
        <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner" />
        { orderProcessing && <Text align="center" italic>Submitting Order ...</Text> }
    </Modal>
)

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
    <StripeProvider apiKey="pk_test_FtLwBsDwEyIs1haJaok8oBpI00jjOKw9qo">
        <Elements>
            <CheckoutForm/>

        </Elements>
    
    </StripeProvider>
)
export default Checkout;
