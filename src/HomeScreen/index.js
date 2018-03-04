import React, { Component } from "react";
import HomeScreen from "./HomeScreen.js";
import MainScreenNavigator from "../ChatScreen/index.js";
import Profile from "../ProfileScreen/index.js";
import FeedbackScreen from "../FeedbackScreen/FeedbackScreen.js";
import RatingScreen from "../RatingScreen/RatingScreen.js";
import SettingsScreen from "../SettingsScreen/SettingsScreen.js";
import Poems from "../PoemScreen/index.js";
import Joke from "../JokeScreen/index.js";
import Proverbs from "../ProverbsScreen/index.js";
import Quotes from "../QuotesScreen/index.js";
import LoginScreen from "../LoginScreen/LoginScreen.js";
import SignUpScreen from "../SignUpScreen/SignUpScreen.js";
import ProfileScreen from "../ProfileScreen/index.js";
import PoemDetail from "../PoemDetailScreen/index.js";
import JokeDetail from "../JokeDetailScreen/index.js";
import ProverbsDetail from "../ProverbsDetailScreen/index.js";
import QuotesDetail from "../QuotesDetailScreen/index.js";
import SideBar from "../SideBar/SideBar.js";
import { DrawerNavigator, StackNavigator } from "react-navigation";

const DrawerNav = DrawerNavigator(
    {
        Home: { screen: HomeScreen },
        Login: { screen: LoginScreen },
        SignUp:{screen:SignUpScreen},
        Profile:{screen:ProfileScreen},
        Feedback:{screen:FeedbackScreen},
        Rating:{screen:RatingScreen},
        Setting:{screen:SettingsScreen},
        Poems: { screen: Poems },
        Joke: { screen: Joke },
        FrenchJoke: { screen: Joke },
        SpanishJoke: { screen: Joke },
        CreoleJoke: { screen: Joke },
        SpanishPoems: { screen: Poems },
        FrenchPoems: { screen: Poems },
        CreolePoems: { screen: Poems },
        Proverbs:{screen:Proverbs},
        FrenchProverbs:{screen:Proverbs},
        SpanishProverbs:{screen:Proverbs},
        CreoleProverbs:{screen:Proverbs},
        Quotes:{screen:Quotes},
        FrenchQuotes:{screen:Quotes},
        SpanishQuotes:{screen:Quotes},
        CreoleQuotes:{screen:Quotes},
        //EnglishHome:{screen:HomeScreen},
        SpanishHome:{screen:HomeScreen},
        FrenchHome:{screen:HomeScreen},
        CreoleHome:{screen:HomeScreen}
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);

const HomeScreenRouter = StackNavigator(
    {

        Home: {
            screen: DrawerNav,
            navigationOptions: {
                header: null,
            },
        },

        PoemDetailHome: {
            screen: PoemDetail
        },
        JokeDetailHome: {
            screen: JokeDetail
        },
        ProverbsDetailHome: {
            screen: ProverbsDetail
        },
        QuotesDetailHome: {
            screen: QuotesDetail
        },
        Login: {
            screen: LoginScreen
        }

    }
);

export default HomeScreenRouter;
