import React, { Component } from "react";
import QuotesDetail from "./QuotesDetailScreen.js";

import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({

    QuotesDetail: { screen: QuotesDetail },

}));