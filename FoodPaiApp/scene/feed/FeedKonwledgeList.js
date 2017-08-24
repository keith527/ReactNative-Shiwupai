
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, TouchableOpacity, Image, RefreshControl} from 'react-native';
import {observer} from 'mobx-react/native';
import {action, reaction, useStrict} from 'mobx';
import FeedBaseStore from '../../store/FeedBaseStore';
import Loading from '../../component/Loading';
import LoadMoreFooter from '../../component/LoadMoreFooter';
import Toast from 'react-native-easy-toast';
import FeedSingleImageCell from '../../component/FeedSingleImageCell';
import FeedMultiImageCell from '../../component/FeedMultiImageCell';
import {Actions} from 'react-native-router-flux';

useStrict(true);

class KnowledgtItem extends Component {

    static propTypes = {
        feed: React.PropTypes.object,
        onPress: React.PropTypes.func
    }

    _onPress = () => {
        const {onPress, feed} = this.props;
        onPress && onPress(feed);
    }

    render(){
        const {feed: {title, source, tail, images}} = this.props;
        const cellData = {title, source, viewCount:tail, images}
        if(images.length == 1){
            return (<FeedSingleImageCell {...cellData} onPress={this._onPress}/>);

        }
        return (<FeedMultiImageCell {...cellData} onPress={this._onPress}/>);
    }
}

@observer
export default class FeedKonwledgeList extends Component{


    knowledgeFeedStore = new FeedBaseStore(this.props.categoryId);

    state = {
        dataSource : new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
    }

    componentDidMount() {
        this.dispose = reaction(() => [
            this.knowledgeFeedStore.page,
            this.knowledgeFeedStore.isRefreshing,
        ],
            () => this.knowledgeFeedStore.fetchFeedList())
    }

    componentWillUnMount() {
        this.dispose();
    }

    componentWillReact() {
        const {errorMsg} = this.knowledgeFeedStore
        errorMsg && this.toast.show(errorMsg)
    }


    @action
    _onEndReached = () => {
        const {isNoMore} = this.knowledgeFeedStore;
        if(! isNoMore){
            this.knowledgeFeedStore.page++;
        }
    }

    @action
    _onRefresh = () => {
        this.knowledgeFeedStore.isRefreshing = true;
    }

    _itemPress = (feed) => {
        Actions.feedDetail({
            feed
        });
    }

    _renderRow = (feed, key) => {
        return(<KnowledgtItem key={`${feed.item_id}-${key}`} feed={feed} onPress={this._itemPress}/>);
    }

    _renderFooter = () => {
        const {isNoMore, isFetching} = this.knowledgeFeedStore;
        return(
            !isFetching && <LoadMoreFooter isNoMore={isNoMore}/>
        )
    }

    render(){
        const {dataSource} = this.state;
        const {isFetching, feedList, isRefreshing} = this.knowledgeFeedStore;

        return(
            <View style={{flex:1, backgroundColor:gColors.background}}>
                <ListView
                    enableEmptySections={true}
                    style={{marginVertical:10}}
                    dataSource={dataSource.cloneWithRows(feedList.slice(0))}
                    onEndReachedThreshold={30}
                    onEndReached={this._onEndReached}
                    renderFooter={this._renderFooter}
                    renderRow={this._renderRow}
                    refreshControl = {
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                            title="Loading"
                        />
                  }/>
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        );
    }
}