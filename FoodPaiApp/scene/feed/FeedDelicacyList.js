
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, RefreshControl} from 'react-native';
import {action, reaction, useStrict} from 'mobx';
import {observer} from 'mobx-react/native';
import FeedBaseStore from '../../store/FeedBaseStore';
import FeedMultiImageCell from '../../component/FeedMultiImageCell';
import FeedSingleImageCell from '../../component/FeedSingleImageCell';
import Toast from 'react-native-easy-toast';
import Loading from '../../component/Loading';
import LoadMoreFooter from '../../component/LoadMoreFooter';
import {Actions} from 'react-native-router-flux';
useStrict(true);

class FeedDelicacyItem extends Component{

    static propTypes = {
        feed: React.PropTypes.object,
        onPress: React.PropTypes.func,
    }

    _onPress = () => {
        const {feed, onPress} = this.props;
        onPress && onPress(feed);
    }

    render(){

        const {feed:{title,source,tail,images}} = this.props;
        const cellData = {title, source, viewCount:tail, images};

        if(images.length === 1){
            return (<FeedSingleImageCell {...cellData} onPress={this._onPress}/>);
        }
            return (<FeedMultiImageCell {...cellData} onPress={this._onPress}/>);


    }
}

@observer
export default class FeedDelicacyList extends Component{

    delicacyFeedStore = new FeedBaseStore(this.props.categoryId);

    state = {
        dataSource : new ListView.DataSource({
            rowHasChanged: (r1,r2) => r1 !== r2,

        })
    };

    componentDidMount() {

        this.dispose = reaction(() => [
                this.delicacyFeedStore.isRefreshing,
                this.delicacyFeedStore.page
            ],
            ()=> this.delicacyFeedStore.fetchFeedList());
    }

    componentWillUnMount() {
        this.dispose();
    }

    componentWillReact() {
        const {errorMsg} = this.delicacyFeedStore
        errorMsg && this.toast.show(errorMsg)
    }


    _onItemPress = (feed) => {
        Actions.feedDetail({
            feed
        });
    }

    _renderRow = (feed, key) => {

        return(<FeedDelicacyItem key={`${feed.item_id}-${key}`} feed={feed} onPress={this._onItemPress} />);
    }

    @action
    _onRefresh = () => {
        this.delicacyFeedStore.isRefreshing = true;
    }

    @action
    _onEndReached = () => {
        const {isNoMore} = this.delicacyFeedStore;
        if(! isNoMore){
            this.delicacyFeedStore.page++;
        }
    }
    _renderFooter = () => {
        const {isNoMore,isFetching} = this.delicacyFeedStore;
        return(
            !isFetching&&<LoadMoreFooter isNoMore={isNoMore}/>
        )
    }
    render(){
        const {dataSource} = this.state;
        const {isRefreshing, feedList, isFetching} = this.delicacyFeedStore;
      //  alert(feedList.length);
        return(

            <View style={{flex:1, backgroundColor:gColors.background}}>
            <ListView

                enableEmptySections={true}
                onEndReachedThreshold={30}
                onEndReached={this._onEndReached}
                dataSource={dataSource.cloneWithRows(feedList.slice(0))}
                renderRow={this._renderRow}
                renderFooter={this._renderFooter}
                onRefresh={
                <RefreshControl
                    refreshing={isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                            title="Loading"/>
                }
          />
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        );
    }
}