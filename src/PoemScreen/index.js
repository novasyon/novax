import React, {Component} from "react";
import AsyncStorage from "react-native";
import Poems from "./Poems.js";
import PoemTags from "./PoemsTags.js";
import PoemThemes from "./PoemsThemes.js";
import PoemDetail from "../PoemDetailScreen/PoemDetail"
import AddPoem from "../PoemDetailScreen/AddPoem"
import DetailTag from "../PoemDetailScreen/DetailTag"
import Search from '../SearchScreen/Search'
import ListPoemsByUser from "./ListPoemsByUser.js";
import {TabNavigator, StackNavigator} from "react-navigation";
import {
  Button,
  Container,
  Header,
  Body,
  Left,
  Right,
  Title,
  Text,
  Icon,
  Item,
  Footer,
  FooterTab,
  Label,
  StyleProvider
} from "native-base";
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import {language} from '../config/language.js'

function getLanguage() {
  AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
    console.log("Chosen Language:", chosenLanguage);
    if (chosenLanguage == 'english') {
      console.log("English:", language.english);
      lang = language.english;
    } else if (chosenLanguage == 'spanish') {
      console.log("Spanish:", language.spanish);
      lang = language.spanish;
    } else if (chosenLanguage == 'french') {
      console.log("French:", language.french);
      lang = language.french;
    } else if (chosenLanguage == 'creole') {
      console.log("Creole:", language.creole);
      lang = language.creole;
    }
  }).done();

}

const TabNav = TabNavigator({
  Poems: {
    screen: Poems
  },
  PoemTags: {
    screen: PoemTags
  },
  PoemThemes: {
    screen: PoemThemes
  }
}, {

  tabBarPosition: "bottom",
  tabBarComponent: props => {

    let lang = language.english;

    //getLanguage();

    return (<StyleProvider style={getTheme(material)}>
      <Footer>
        <FooterTab>
          <Button vertical="vertical" active={props.navigationState.index === 0} onPress={() => props.navigation.navigate("Poems", {language: lang})}>
            <Icon name="paper"/>
          </Button>
          <Button vertical="vertical" active={props.navigationState.index === 1} onPress={() => props.navigation.navigate("PoemTags")}>
            <Icon name="pricetags"/>

          </Button>
          <Button vertical="vertical" active={props.navigationState.index === 2} onPress={() => props.navigation.navigate("PoemThemes")}>
            <Icon name="albums"/>
          </Button>
        </FooterTab>
      </Footer>
    </StyleProvider>);
  }
})

const PoemScreenNavigator = StackNavigator({
  Root: {
    screen: TabNav,
    navigationOptions: {
      header: null
    }
  },
  PoemDetail: {
    screen: PoemDetail
  },
  AddPoem: {
    screen: AddPoem
  },
  Search: {
    screen: Search
  },
  DetailTag: {
    screen: DetailTag
  },
  ListPoemsByUser: {
    screen: ListPoemsByUser
  }
});

export default PoemScreenNavigator;
