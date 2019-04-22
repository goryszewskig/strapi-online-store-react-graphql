import React, { Component } from 'react';
import { Spinner, Icon, Card, Container, Box, Heading, Image, Text, SearchField } from 'gestalt';
import { Link } from 'react-router-dom';
import Loader from './Loader';

import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);



class App extends Component {
  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true

  }
  async componentDidMount(){
    try {

      const { data } = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                url
              }
            }
          }
  
          `
        }
      });
      // console.log(response);
      this.setState({brands: data.brands, loadingBrands: false});
    } catch(err) {
      console.error(err);
      this.setState({ loadingBrands: false});
    }
  }

  handleChange = ({ value })=> {
    this.setState({ searchTerm: value })
  }

  filteredBrands  = ({ searchTerm, brands }) => {
    return brands.filter(brand => {
      return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    })
  }
  render() {
    const { searchTerm, loadingBrands } = this.state;
    return (
      <Container>
        {/*Brands Selection*/}
        <Box display="flex" justifyContent="center" margin={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            placeholder="Search Brands"
            value={searchTerm}

          /> 
          <Box margin={3}>
          
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter"
            />

          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          marginBottom={2}

        >
        {/* brands headers */}
        <Heading color="midnight" size="md">
          Brew Brands
        
        </Heading>
        
        </Box>
        {/* brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
          
        >
          { this.filteredBrands(this.state).map(brand => (
            <Box
              paddingY={4}
              key ={brand._id}
              width={200}
              margin={2}
            >
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                    fit="cover"
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image.url}`}
                    />
                  </Box>
                }
              >
              <Box 
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Text size="xl">{brand.name}</Text>
                <Text >{brand.description}</Text>
                <Text size="xl">
                  <Link to={`/${brand._id}`}>See Brews</Link>
                </Text>
                </Box>
                
              </Card>
            </Box>

          ))}
        </Box>
        { /* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" /> */ }
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
