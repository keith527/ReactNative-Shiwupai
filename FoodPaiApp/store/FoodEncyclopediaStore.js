/**
 * Created by ljunb on 2016/12/14.
 */
import {observable, runInAction, computed, action,useStrict} from 'mobx'
import {get} from '../util/HttpTool'
useStrict(true)

class FoodEncyclopediaStore {

    @observable foodCategoryList = []
    @observable errorMsg = ''

    @action
    fetchCategoryList = async() => {
        try {
            const url = 'http://food.boohee.com/fb/v1/categories/list'
            const responseData = await get({url, timeout: 30}).then(res => res.json())
            // action只能包裹异步的函数体，如果要在返回函数中改变state 则需要使用到runInAction
            runInAction(() => {
                this.foodCategoryList.replace(responseData.group)
                this.errorMsg = ''
            })
        } catch (error) {
            if (error.msg) {
                this.errorMsg = error.msg
            } else {
                this.errorMsg = error
            }
        }
    }

    @computed
    get isFetching() {
        return this.foodCategoryList.length === 0 && this.errorMsg === ''
    }

    @computed
    get isNoResult() {
        return this.foodCategoryList.length === 0
    }
}

export default FoodEncyclopediaStore
