import React, { Component } from "react";
import AsyncStorage from "react-native";
import Quotes from "./Quotes.js";
import QuotesTags from "./QuotesTags.js";
import QuotesThemes from "./QuotesThemes.js";
import QuotesDetail from "../QuotesDetailScreen/QuotesDetailScreen"
import AddProverbs from "../ProverbsDetailScreen/AddProverbs"
import DetailTag from "../QuotesDetailScreen/DetailTag"
import Search from '../SearchScreen/Search'
import ListProverbsByUser from "./ListProverbsByUser.js";
import { TabNavigator, StackNavigator } from "react-navigation";
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
    Label, StyleProvider
} from "native-base";
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'


function getLanguage(){
    AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
                //console.log("Chosen Language:", chosenLanguage);
                if (chosenLanguage == 'english') {
                    //console.log("English:", language.english);
                    lang = language.quotes_english;
                } else if (chosenLanguage == 'spanish') {
                    //console.log("Spanish:", language.quotes_spanish);
                    lang = language.quotes_spanish;
                } else if (chosenLanguage == 'french') {
                    //console.log("French:", language.quotes_french);
                    lang = language.quotes_french;
                } else if (chosenLanguage == 'creole') {
                    //console.log("Creole:", language.creole);
                    lang = language.quotes_creole;
                }
            }).done();

}

const TabNav = TabNavigator(

    {
        Quotes: { screen: Quotes },
        QuotesTags: { screen: QuotesTags},
        QuotesThemes: { screen: QuotesThemes }
    },

    {

        tabBarPosition: "bottom",
        tabBarComponent: props => {

            let lang = language.quotes_english;

            
            

            //getLanguage();

            return (
                
                <StyleProvider style={getTheme(material)}>
                    <Footer>
                        <FooterTab>
                            <Button
                                vertical
                                active={props.navigationState.index === 0}
                                onPress={() => props.navigation.navigate("Quotes", { language: lang })}
                            >
                                <Icon name="paper" />
                            </Button>
                            <Button
                                vertical
                                active={props.navigationState.index === 1}
                                onPress={() => props.navigation.navigate("QuotesTags")}
                            >
                                <Icon name="pricetags" />
                                
                            </Button>
                            <Button
                                vertical
                                active={props.navigationState.index === 2}
                                onPress={() => props.navigation.navigate("QuotesThemes")}
                            >
                                <Icon name="albums" />
                            </Button>
                        </FooterTab>
                    </Footer>
                </StyleProvider>

            );
        }
    }
)

const QuotesScreenNavigator = StackNavigator({
    Root: {
        screen: TabNav,
        navigationOptions: {
            header: null,
        },
    },
    QuotesDetail: {
        screen: QuotesDetail
    },
    AddProverbs: {
        screen: AddProverbs
    },
    Search: {
        screen: Search
    },
    DetailTag: { screen: DetailTag },
    ListProverbsByUser: { screen: ListProverbsByUser }
});

export default QuotesScreenNavigator;

