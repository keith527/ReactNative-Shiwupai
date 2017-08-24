
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, TouchableOpacity,
    ActivityIndicator, Image, RefreshControl, ScrollView} from 'react-native';
import Loading from '../../component/Loading';
import LoadMoreFooter from '../../component/LoadMoreFooter';
import {observer} from 'mobx-react/native';
import {reaction, action} from 'mobx';
import AutoResponisve from 'autoresponsive-react-native'
import FeedBaseStore from '../../store/FeedBaseStore';
import {Actions} from 'react-native-router-flux';

const itemWidth = (gScreen.width - 15 * 2 - 10) / 2;
let canLoadMore = false;

@observer
class FeedItem extends Component {

    _onPress = () => {
        const {feed, onPress} = this.props;
        onPress && onPress(feed);
    }

    render(){
        const {feed, onPress, style, titleHeight} = this.props;
        let imageH = feed.content_type != 5 ? style.width+50:style.width;

        // 返回的数据中，头像出现null的情况，所以source仍然做个判断
        let publisherAvatar = feed.publisher_avatar ? {uri: feed.publisher_avatar} : require('../../resource/img_default_avatar.png');

        return(
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={this._onPress}
                style={[{backgroundColor: '#fff'},style]}>
                <Image style={{width:style.width, height:imageH}}
                       source={{uri:feed.card_image}}
                       defaultSource={require('../../resource/img_horizontal_default.png')}/>
                {feed.content_type == 5 &&
                <View
                    style={{
                        height: titleHeight,
                        width:style.width,
                        paddingHorizontal:4,
                        paddingTop:8

                    }}>
                    <View style={{
                        height: titleHeight - 8,
                        width: style.width - 8,
                        justifyContent: 'space-around',
                        borderBottomWidth: gScreen.onePix,
                        borderColor: '#ccc'
                    }}>
                        <Text style={{fontSize: 14, color: 'black'}} numberOfLines={1}>{feed.title}</Text>
                        {feed.description != '' &&
                        <Text style={{color: 'gray', fontSize: 13}} numberOfLines={2}>{feed.description}</Text>
                        }
                    </View>
                </View>
                }
                {feed.content_type == 5 &&
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 50,
                    paddingHorizontal: 4
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={{height: 30, width: 30, borderRadius: 15}}
                            source={publisherAvatar}
                            defaultSource={require('../../resource/img_default_avatar.png')}
                        />
                        <Text
                            style={{fontSize: 11, color: 'gray', marginLeft: 8, width: style.width * 0.4}}
                            numberOfLines={1}
                        >
                            {feed.publisher}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{height: 12, width: 12}} source={require('../../resource/ic_feed_like.png')}/>
                        <Text style={{fontSize: 11, color: 'gray', marginLeft: 2}}>{feed.like_ct}</Text>
                    </View>
                </View>
                }
            </TouchableOpacity>
        );

    }

}

@observer
export default class FeedHomeList extends Component{

    feedBaseStore = new FeedBaseStore(this.props.categoryId);

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
        const {errorMsg} = this.feedBaseStore;
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
        canLoadMore = false;
    }

    @action
    _onMomentumScrollEnd = event => {
        const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
        let contentSizeH = contentSize.height;
        let viewBottomY = contentOffset.y + layoutMeasurement.height;

        canLoadMore = viewBottomY >= contentSizeH;

        if (Math.abs(viewBottomY - contentSizeH) <= 40 && canLoadMore) {
            this.feedBaseStore.page++
            canLoadMore = false
        }
    }

    _onPressChild = (feed) => {
        Actions.feedDetail({
            feed
        });
    }

    _renderChildren = (feed, key) => {
        // 默认高度
        let height = itemWidth + 50;
        let titleHeight = 30;
        if (feed.description) {
            if (feed.description.length !== 0 && feed.description.length < 13) {
                titleHeight += 25;
            } else if (feed.description.length >= 13) {
                titleHeight += 40
            }
        }
        height += titleHeight;

        if (feed.content_type !== 5) height = itemWidth + 50;

        const style = {
            width: itemWidth,
            height,
            marginLeft: 15
        }

        return(<FeedItem key={`${feed.item_id}-${key}`}
                         feed={feed}
                         onPress={this._onPressChild}
                         style={style}
                         titleHeight={titleHeight}/>)
    }

    getAutoResponsiveProps(){
        return {
            itemMargin: 10,
        };
    }

    render(){

        const {feedList, isFetching, isRefreshing, isNoMore} = this.feedBaseStore;
        const scrollViewH = gScreen.height - gScreen.navBarHeight  - 44 - 10;
        const feedArray = feedList.slice()
        return(
            <View style={{backgroundColor:gColors.background, flex:1}}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingTop:10}}
                  style={{width:gScreen.width, height: scrollViewH}}
                  automaticallyAdjustContentInsets = {false}
                  removeClippedSubviews
                  bounces
                  scrollEventThrottle={16}
                  onMomentumScrollEnd = {this._onMomentumScrollEnd}
                  refreshControl = {
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                             title="Loading"
                        />
                  }
                >
                    {!isFetching &&
                    <AutoResponisve {...this.getAutoResponsiveProps()}>
                        {feedArray.map(this._renderChildren)}
                    </AutoResponisve>
                    }
                    {!isFetching &&
                    <LoadMoreFooter isNoMore={isNoMore}/>}

                </ScrollView>
                <Loading isShow={isFetching}/>
            </View>
        );
    }
}