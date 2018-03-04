import React from "react";
import {
  AsyncStorage, StyleSheet, StatusBar, View, Image, Dimensions
} from "react-native";
import {
  Button, Text, Container, Card, CardItem, Body, Content, Header, Title, List, Left,
  Icon, Right, H2, H3, Spinner, StyleProvider, Thumbnail
} from "native-base";
import {language} from '../config/language.js'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import LoginScreen from "../LoginScreen/LoginScreen.js";
import {configz} from '../config/config.js';
import PoemDeck from '../components/PoemDeck.js'
import PoemCards from '../components/PoemCards.js'
import JokeCards from '../components/JokeCards.js'
import ProverbsCards from '../components/ProverbsCards.js'
import QuotesCards from '../components/QuotesCards.js'

export default class HomeScreen extends React.Component {

  //statusBarPadding = configz.setting.statusBarPadding;

  constructor(props) {
    super(props);
    this.state = {
      //language:language.english,
      poemLanguage: language.english,
      poemScript: language.english.poemUrl,
      jokeLanguage: language.jokes_english,
      jokeScript: language.jokes_english.api,
      proverbLanguage: language.proverbs_english,
      proverbScript: language.proverbs_english.api,
      quotesLanguage: language.quotes_english,
      quotesScript: language.quotes_english.api,
      isLoading: true,
      isLoadingJokes: true,
      isLoadingProverbs: true,
      isLoadingQuotes: true,
      getLanguages: false,
      poems: [],
      jokes: [],
      proverbs: [],
      quotes: []
    }
  }

  getLanguage() {

    AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
      console.log("Chosen Language:", chosenLanguage);
      if (chosenLanguage == 'english') {
        this.setState({
          poemLanguage: language.english,
          poemScript: language.english.poemUrl,
          jokeLanguage: language.jokes_english,
          jokeScript: language.jokes_english.api,
          proverbLanguage: language.proverbs_english,
          proverbScript: language.proverbs_english.api,
          quotesLanguage: language.quotes_english,
          quotesScript: language.quotes_english.api
        });
      } else if (chosenLanguage == 'spanish') {
        this.setState({
          poemLanguage: language.spanish,
          poemScript: language.spanish.poemUrl,
          jokeLanguage: language.jokes_spanish,
          jokeScript: language.jokes_spanish.api,
          proverbLanguage: language.proverbs_spanish,
          proverbScript: language.proverbs_spanish.api,
          quotesLanguage: language.quotes_spanish,
          quotesScript: language.quotes_spanish.api
        });
      } else if (chosenLanguage == 'french') {
        this.setState({
          poemLanguage: language.french,
          poemScript: language.french.poemUrl,
          jokeLanguage: language.jokes_french,
          jokeScript: language.jokes_french.api,
          proverbLanguage: language.proverbs_french,
          proverbScript: language.proverbs_french.api,
          quotesLanguage: language.quotes_french,
          quotesScript: language.quotes_french.api
        });
      } else if (chosenLanguage == 'creole') {
        this.setState({
          poemLanguage: language.creole,
          poemScript: language.creole.poemUrl,
          jokeLanguage: language.jokes_creole,
          jokeScript: language.jokes_creole.api,
          proverbLanguage: language.proverbs_creole,
          proverbScript: language.proverbs_creole.api,
          quotesLanguage: language.quotes_creole,
          quotesScript: language.quotes_creole.api
        });
      } else {
        console.log("Set Default");
        this.setState({
          poemLanguage: language.english,
          poemScript: language.english.poemUrl,
          jokeLanguage: language.jokes_english,
          jokeScript: language.jokes_english.api,
          proverbLanguage: language.proverbs_english,
          proverbScript: language.proverbs_english.api,
          quotesLanguage: language.quotes_english,
          quotesScript: language.quotes_english.api
        });
      }

    }).done(() => {
      console.log("Done!");
      this.getContent();
    });
  }

  getContent() {

    this.getRandomProverbs();
    this.getRandomQuotes();
    this._getRandomPoem();
    this.getRandomJokes();

  }

  shouldComponentUpdate() {
    console.log("Homescreen shouldComponentUpdate ");
    return true
  }

  componentWillReceiveProps() {
    console.log("Component will receive props");
    this.getLanguage();
  }

  componentDidMount() {
    console.log("Homescreen Did Mount");
    //this.setState({getLanguagess:true});
    this.getLanguage();
  }

  getRandomQuotes() {

    console.log("Random Quotes");

    this.setState({isLoadingQuotes: true, quotes: []});

    let randomUrl = 'http://novasyon.net/apps/novasyon/' + this.state.quotesScript + '?random';

    return fetch(randomUrl).then((response) => response.json()).then((responseJson) => {
      //console.log("Jokes Random:", responseJson);

      let jsonArr = [];

      if (responseJson instanceof Array) {
        jsonArr = responseJson;
      } else {
        jsonArr.push(responseJson);
      }
      this.setState({
        title: 'Random Quotes',
        isLoadingQuotes: false,
        quotes: jsonArr
      }, function() {
        // do something with new state
      });
    }).catch((error) => {
      console.error(error);
    });

  }

  getRandomProverbs() {

    console.log("Random Proverbs");

    this.setState({isLoadingProverbs: true, proverbs: []});

    let randomUrl = 'http://novasyon.net/apps/novasyon/' + this.state.proverbScript + '?random';

    return fetch(randomUrl).then((response) => response.json()).then((responseJson) => {
      //console.log("Jokes Random:", responseJson);

      let jsonArr = [];

      if (responseJson instanceof Array) {
        jsonArr = responseJson;
      } else {
        jsonArr.push(responseJson);
      }
      this.setState({
        title: 'Random Jokes',
        isLoadingProverbs: false,
        proverbs: jsonArr
      }, function() {
        // do something with new state
      });
    }).catch((error) => {
      console.error(error);
    });

  }

  getRandomJokes() {

    console.log("Random Jokes");

    this.setState({isLoadingJokes: true, jokes: []});

    let randomJokesUrl = 'http://novasyon.net/apps/novasyon/' + this.state.jokeScript + '?random';

    return fetch(randomJokesUrl).then((response) => response.json()).then((responseJson) => {
      console.log("Jokes Random:", responseJson);

      let jsonArr = [];

      if (responseJson instanceof Array) {
        jsonArr = responseJson;
      } else {
        jsonArr.push(responseJson);
      }

      this.setState({
        title: 'Random Jokes',
        isLoadingJokes: false,
        jokes: jsonArr
      }, function() {
        // do something with new state
      });
    }).catch((error) => {
      console.error(error);
    });

  }

  _getRandomPoem() {

    console.log("Get Random Poem");

    this.setState({isLoading: true, isListPoem: true, poems: []});

    let randomPoemUrl = 'http://novasyon.net/apps/novasyon/' + this.state.poemScript + '?random';

    return fetch(randomPoemUrl).then((response) => response.json()).then((responseJson) => {
      console.log("Poems:", responseJson);

      let jsonArr = [];

      if (responseJson instanceof Array) {
        jsonArr = responseJson;
      } else {
        jsonArr.push(responseJson);
      }

      this.poems = responseJson;
      this.setState({
        title: 'Random Poems',
        isLoading: false,
        poems: jsonArr
      }, function() {
        // do something with new state
      });
    }).catch((error) => {
      console.error(error);
    });

  }

  renderPoemCards() {

    return <PoemCards data={this.state.poems} language={this.state.poemLanguage} navigation={this.props.navigation}/>
  }

  renderJokeCards() {

    return <JokeCards data={this.state.jokes} language={this.state.jokeLanguage} navigation={this.props.navigation}/>
  }

  renderProverbsCards() {

    return <ProverbsCards data={this.state.proverbs} language={this.state.proverbLanguage} navigation={this.props.navigation}/>
  }

  renderQuotesCards() {

    return <QuotesCards data={this.state.quotes} language={this.state.quotesLanguage} navigation={this.props.navigation}/>
  }

  render() {

    console.log("Homescreen render");
    //this.getLanguage();

    if (this.state.isLoading) {
      return (<View style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}>
        <Spinner color='blue'/>
      </View>);
    }

    return (<StyleProvider style={getTheme(material)}>
      <Container>
        <Header noShadow="noShadow" androidStatusBarColor='#000' style={{
            marginTop: 0,
            paddingTop: 60,
            paddingBottom: 40,
            elevation: 0
          }}>
          <Left>
            <Button transparent="transparent" onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu"/>
            </Button>
          </Left>
          <Body>
            <Title>
              <Image style={{
                  width: 50,
                  height: 50
                }} source={{
                  uri: 'http://novasyon.net/images/nova.png'
                }}/>
              Novasyon</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          {this.renderPoemCards()}
          {this.renderQuotesCards()}
          {this.renderProverbsCards()}
          {this.renderJokeCards()}

        </Content>
      </Container>
    </StyleProvider>);
  }
}

const styles = StyleSheet.create({

  cardheader: {
    backgroundColor: '#ebebeb',
    borderBottomWidth: 1
  },

  cardFooter: {
    color: '#fff',
    fontSize: 18
  }

});
