import React, { Component } from "react";
import ProverbsDetail from "./ProverbsDetailScreen.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({

    ProverbsDetail: { screen: ProverbsDetail },

}));