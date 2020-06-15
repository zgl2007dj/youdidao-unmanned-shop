import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import "./index.less";
import { points } from "./service";
import { userInfo } from "../../../pages/orderDetails/service";
import moment from "moment";
moment.locale("zh-cn");


interface IState {
  current: number;
  query: {
    data?: any;
  };
  myIntegral?: any;
  balanceQuery: {
    data: any;
  };
  list?: any;
}
export default class Home extends Component<null, IState> {
  config: Config = {
    navigationBarTitleText: "我的积分",
  };

  state = {
    current: 0,
    query: {
      loading: true,
      data: {
        points: {
          list: [],
        },
      }
    },
    balanceQuery: {
      data: null
    },
    list: [],
    myIntegral: null,
  };

  async componentWillMount() {
    const { id } = this.$router.params;
    const pointsResult = await points(id, 1, 10);
    this.setState({
      query: pointsResult
    });
    const token = Taro.getStorageSync('accessToken');
    if (token) {
      const { data } = await userInfo();
      this.setState({
        myIntegral: data.userInfo
      });
    }
  }
  async onPullDownRefresh() {
    const { id } = this.$router.params;
    const pointsResult = await points(id, 1, 10);
    this.setState({
      query: pointsResult
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh(); //停止下拉刷新
    }, 1000);
  }

  render() {
    const { query, myIntegral } = this.state;
    // if (query.loading) {
    //   return Taro.showLoading({
    //     title: "加载中"
    //   });
    // }
    // else {
    //   Taro.hideLoading();
    // }
    const listDetail = query.data.points.list;

    return (
      <View className="index">
        <View className="banner">
        </View>
        <View className="myIntegral">
          <View className="integralCon">
            <View className="integralTxt">
              <Text>当前积分</Text>
              <Text className="integralContent">积分说明</Text>
            </View>
            <View className="integralTxt">
              <Text className="integralTitle">{myIntegral.point ? myIntegral.point / 100 : ""}</Text>个
              <Button className="integralExchange">兑换</Button>
            </View>
          </View>
        </View>

        <View className="myIntegralBox">
          <View className="IntegralBoxTitle">
            <Text>积分明细</Text>
            <Text className="IntegralBoxTxt">最近30条积分明细</Text>
          </View>
          <View>
            {listDetail.map(item => (
              <View className="IntegralBoxCon">
                <View className="IntegralBoxTime">
                  <Text>{item.remark}</Text>
                  <Text className="IntegralBoxTimeNum">{moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</Text>
                </View>
                <View className="IntegralBox_view">
                  <Text className="IntegralBoxNum">{item.add ? '+' : '-'}</Text>
                  <Text className="IntegralBoxNum">{item.price / 100}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </View>
    );
  }
}
