
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, TouchableOpacity,
    ActivityIndicator, Image, RefreshControl, ScrollView} from 'react-native';
import Loading from '../../component/Loading';
import LoadMoreFooter from '../../component/LoadMoreFooter';
import {observer} from 'mobx-react/native';
import {reaction, action, useStrict} from 'mobx';
import AutoResponisve from 'autoresponsive-react-native'
import FeedBaseStore from '../../store/FeedBaseStore';
import {Actions} from 'react-native-router-flux';

const itemWidth = (gScreen.width - 15 * 2 - 10) / 2;

useStrict(true);

@observer
class FeedItem extends Component {

    _onPress = () => {
        const {feed, onPress} = this.props;
        onPress && onPress(feed);
    }

    render(){
        const {feed, onPress} = this.props;
        const style = {
            width:gScreen.width,
            height:gScreen.width/2+20,
            justifyContent:'space-between',
            alignItems:'center',
            backgroundColor: 'transparent',
            paddingVertical:20,

        }
        const titleStyle = {
            color:'#fff',
            fontSize:16,
            fontWeight:'bold',
            width: gScreen.width * 0.62,
            textAlign: 'center',
            lineHeight: 20,
            backgroundColor: 'rgba(1,1,1,0)'
            }
        return(
          <TouchableOpacity
                activeOpacity={0.85}
                onPress={this._onPress}
                style={{width:gScreen.width,height:gScreen.width/2+20, marginBottom:15}}>
                <Image
                    style={style}
                    source={{uri: feed.background }}>
                    <Text style={{color: '#fff', fontSize: 13}}>{feed.source}</Text>
                    <Text style={titleStyle} numberOfLines={2}>{feed.title}</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={{width:12, height:12}} source={require('../../resource/ic_feed_read.png')}/>
                        <Text style={{color:'#fff', fontSize:13}}>{feed.tail}</Text>
                    </View>

                </Image>
          </TouchableOpacity>
        );

    }

}

@observer
export default class FeedEvaluatingList extends Component{

    feedBaseStore = new FeedBaseStore(this.props.categoryId);

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
    }

    componentDidMount() {
        this.dispose = reaction(
            () => [
                this.feedBaseStore.page,
                this.feedBaseStore.isRefreshing,
            ],
            () => this.feedBaseStore.fetchFeedList())

    }



    componentWillUnmount() {
        this.dispose()
    }

    componentWillReact() {
        const {errorMsg} = this.feedBaseStore
        errorMsg && console.error(errorMsg);
    }


    @action
    _onEndReached = () => {
        if(!this.feedBaseStore.isNoMore){
            this.feedBaseStore.page++;
        }
    }

    @action
    _onRefresh = () => {
        this.feedBaseStore.isRefreshing = true;
    }

    _onPressChild = (feed) => {
        Actions.feedDetail({
            feed
        });
    }


    _renderRow = (feed, key) => {
        return(<FeedItem feed={feed} onPress={this._onPressChild} key={`${feed.item_id}-${key}`}/>);
    }

    _renderFooter = () => {
        const {isFetching, isNoMore} = this.feedBaseStore;
        return(
            !isFetching&&<LoadMoreFooter isNoMore={isNoMore}/>
        )
    }


    render(){
        const {dataSource} = this.state;
        const {feedList, isFetching, isRefreshing, isNoMore} = this.feedBaseStore;
        return(
            <View style={{backgroundColor:gColors.background, flex:1}}>
                <ListView
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                    style={{marginHorizontal:15}}
                    dataSource={dataSource.cloneWithRows(feedList.slice(0))}
                    renderRow={this._renderRow}
                    renderFooter={this._renderFooter}
                    onEndReachedThreshold={30}
                    onEndReached={this._onEndReached}
                    refreshControl = {
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                            title="Loading"
                        />
                  }
                    />
                <Loading isShow={isFetching}/>
            </View>
        );
    }
}