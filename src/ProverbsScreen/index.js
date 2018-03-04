import React, { Component } from "react";
import AsyncStorage from "react-native";
import Proverbs from "./Proverbs.js";
import ProverbsTags from "./ProverbsTags.js";
import ProverbsThemes from "./ProverbsThemes.js";
import ProverbsDetail from "../ProverbsDetailScreen/ProverbsDetailScreen"
import AddProverbs from "../ProverbsDetailScreen/AddProverbs"
import DetailTag from "../ProverbsDetailScreen/DetailTag"
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
                    lang = language.proverbs_english;
                } else if (chosenLanguage == 'spanish') {
                    //console.log("Spanish:", language.proverbs_spanish);
                    lang = language.proverbs_spanish;
                } else if (chosenLanguage == 'french') {
                    //console.log("French:", language.proverbs_french);
                    lang = language.proverbs_french;
                } else if (chosenLanguage == 'creole') {
                    //console.log("Creole:", language.creole);
                    lang = language.proverbs_creole;
                }
            }).done();

}

const TabNav = TabNavigator(

    {
        Proverbs: { screen: Proverbs },
        ProverbsTags: { screen: ProverbsTags},
        ProverbsThemes: { screen: ProverbsThemes }
    },

    {

        tabBarPosition: "bottom",
        tabBarComponent: props => {

            let lang = language.proverbs_english;

            
            

            //getLanguage();

            return (
                
                <StyleProvider style={getTheme(material)}>
                    <Footer>
                        <FooterTab>
                            <Button
                                vertical
                                active={props.navigationState.index === 0}
                                onPress={() => props.navigation.navigate("Proverbs", { language: lang })}
                            >
                                <Icon name="paper" />
                            </Button>
                            <Button
                                vertical
                                active={props.navigationState.index === 1}
                                onPress={() => props.navigation.navigate("ProverbsTags")}
                            >
                                <Icon name="pricetags" />
                                
                            </Button>
                            <Button
                                vertical
                                active={props.navigationState.index === 2}
                                onPress={() => props.navigation.navigate("ProverbsThemes")}
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

const ProverbsScreenNavigator = StackNavigator({
    Root: {
        screen: TabNav,
        navigationOptions: {
            header: null,
        },
    },
    ProverbsDetail: {
        screen: ProverbsDetail
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

export default ProverbsScreenNavigator;

