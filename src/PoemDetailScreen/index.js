import React, { Component } from "react";
import PoemDetail from "./PoemDetail.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({

    PoemDetail: { screen: PoemDetail },

}));