/**
 * Created by ljunb on 16/5/26.
 */
import React, {Component} from 'react'
import {observer, inject} from 'mobx-react/native'
import Feed from './feed/index'
import FoodEncyclopedia from './FoodEncyclopediaScene'
import Profile from './MeScene';
import TabBar from '../component/TabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'

const tabTitles = ['食物百科', '逛吃', '我的']
const tabIcons = [
    require('../resource/ic_tab_search.png'),
    require('../resource/ic_tab_homepage.png'),
    require('../resource/ic_tab_my.png')
]
const tabSelectedIcon = [
    require('../resource/ic_tab_search_select.png'),
    require('../resource/ic_tab_homepage_select.png'),
    require('../resource/ic_tab_my_select.png')
]

//TODO: 猜想：是不是store中包含的可观察对象想在这里使用？「 this.props.app.barStyle」
@inject('app') // 经过测试，如果不添加这一句话，则下面的this.props.app就找不到了。
@observer
export default class TabBarView extends Component {

    onChangeTab = ({i}) => {

        const {app} = this.props
        if (i === 1) {
            app.updateBarStyle('default')
        } else {
            app.updateBarStyle('light-content')
        }
    }

    renderTabBar = () => {
        return (
            <TabBar
                tabNames={tabTitles}
                tabIconNames={tabIcons}
                selectedTabIconNames={tabSelectedIcon}
            />
        )
    }

    render() {
        return (
            <ScrollableTabView
                locked
                style={{backgroundColor:'#fff'}}
                scrollWithoutAnimation
                renderTabBar={this.renderTabBar}
                tabBarPosition='bottom'
                onChangeTab={this.onChangeTab}
            >
                <FoodEncyclopedia tabLabel="Food" />
                <Feed tabLabel="Home" />
                <Profile tabLabel="Me" />
            </ScrollableTabView>
        )
    }
}
