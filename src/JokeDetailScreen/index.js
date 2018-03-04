import React, { Component } from "react";
import JokeDetail from "./JokeDetailScreen.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({

    JokeDetail: { screen: JokeDetail },

}));