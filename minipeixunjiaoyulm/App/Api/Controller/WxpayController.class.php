<?php
namespace Api\Controller;
use Think\Controller;
class WxpayController extends Controller{
	//构造函数
    public function _initialize(){
    	//php 判断http还是https
    	$this->http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
		vendor('WeiXinpay.wxpay');
	}

	//***************************
	//  微信支付 接口
	//***************************
	public function wxpay(){
		$pay_sn = trim($_REQUEST['order_sn']);
		if (!$pay_sn) {
			echo json_encode(array('status'=>0,'err'=>'支付信息错误！'));
			exit();
		}

		$order_info = M('order')->where('order_sn="'.$pay_sn.'"')->find();
		if (!$order_info) {
			echo json_encode(array('status'=>0,'err'=>'没有找到支付订单！'));
			exit();
		}

		if (intval($order_info['status'])!=10) {
			echo json_encode(array('status'=>0,'err'=>'订单状态异常！'));
			exit();
		}

		//①、获取用户openid
		$tools = new \JsApiPay();
		$openId = M('user')->where('id='.intval($order_info['uid']))->getField('openid');
		if (!$openId) {
			echo json_encode(array('status'=>0,'err'=>'用户状态异常！'));
			exit();
		}
		
		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody("婚庆产业博览商品购买_".trim($order_info['order_sn']));
		$input->SetAttach("婚庆产业博览商品购买_".trim($order_info['order_sn']));
		$input->SetOut_trade_no($pay_sn);
		$input->SetTotal_fee(floatval($order_info['amount'])*100);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 3600));
		$input->SetGoods_tag("婚庆产业博览商品购买_".trim($order_info['order_sn']));
		$input->SetNotify_url('https://gzleren.com/miniweddingcybl/index.php/Api/Wxpay/notify');
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);
		//echo '<font color="#f00"><b>统一下单支付单信息</b></font><br/>';
		//printf_info($order);
		$arr = array();
		$arr['appId'] = $order['appid'];
		$arr['nonceStr'] = $order['nonce_str'];
		$arr['package'] = "prepay_id=".$order['prepay_id'];
		$arr['signType'] = "MD5";
		$arr['timeStamp'] = (string)time();
		$str = $this->ToUrlParams($arr);
		$jmstr = $str."&key=".\WxPayConfig::KEY;
		$arr['paySign'] = strtoupper(MD5($jmstr));
		echo json_encode(array('status'=>1,'arr'=>$arr));
		exit();
		//获取共享收货地址js函数参数
		//$editAddress = $tools->GetEditAddressParameters();
		//$this->assign('jsApiParameters',$jsApiParameters);
		//$this->assign('editAddress',$editAddress);
	}

	//***************************
	//  课程微信支付 接口
	//***************************
	public function buycourse(){
		$uid = intval($_REQUEST['uid']);
		$check_user = M('user')->where('id='.intval($uid).' AND del=0')->find();
		if (!$check_user) {
			echo json_encode(array('status'=>0,'err'=>'登录状态异常.'));
			exit();
		}

		$course_id = intval($_REQUEST['course_id']);
		$check = M('user_course')->where('uid='.intval($uid).' AND course_id='.intval($course_id))->find();
		if (!$check) {
			echo json_encode(array('status'=>0,'err'=>'报名信息错误.'));
			exit();
		}

		$check_course = M('course')->where('id='.intval($course_id).' AND del=0')->find();
		if (!$check_course) {
			echo json_encode(array('status'=>0,'err'=>'课程信息错误.'));
			exit();
		}

		if (floatval($check_course['price'])<=0) {
			echo json_encode(array('status'=>0,'err'=>'您已成功报名该课程.'));
			exit();
		}

		//下单
		$data = array();
		$data['uid']=intval($uid);
		$data['addtime']=time();
		$data['del']=0; 
		$data['type']='weixin';
		//订单状态 10未付款20代发货30确认收货（待收货）40交易关闭50交易完成
		$data['status']=10;//未付款
		$data['product_num']=intval(1);
		/*******解决屠涂同一订单重复支付问题 lisa**********/
		$data['order_sn'] = $this->build_order_no();//生成唯一订单号

		$data['order_type'] = 2;
		$oprice = floatval($check_course['price']);

		$data['price']=floatval($oprice);
	    $data['amount']=floatval($oprice);

		$result = M('order')->add($data);
		if(!$result){
			echo json_encode(array('status'=>0,'err'=>'下单失败.'));
			exit();
		}

		//添加产品订单表
		$date = array();
		$date['pid'] = $course_id;
		$date['order_id'] = $result;
		$date['name'] = $check_course['title'];
		$date['price'] = $data['amount'];
		$date['photo_x'] = $check_course['photo'];
		$date['num'] = 1;
		$date['addtime'] = time();
		$res = M('order_product')->add($date);
		if(!$res){
			echo json_encode(array('status'=>0,'err'=>'下单失败.'.__LINE__));
			exit();
		}

		//①、获取用户openid
		$tools = new \JsApiPay();
		$openId = M('user')->where('id='.intval($uid))->getField('openid');
		if (!$openId) {
			echo json_encode(array('status'=>0,'err'=>'用户状态异常！'));
			exit();
		}

		$desc = $check_course['title'].'_'.trim($data['order_sn']);

		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($desc);
		$input->SetAttach($desc);
		$input->SetOut_trade_no(trim($data['order_sn']));
		$input->SetTotal_fee(floatval($data['amount'])*100);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 3600));
		$input->SetGoods_tag($desc);
		$input->SetNotify_url('https://gzleren.com/miniweddingcybl/index.php/Api/Wxpay/notify');
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);
		//echo '<font color="#f00"><b>统一下单支付单信息</b></font><br/>';
		//printf_info($order);
		$arr = array();
		$arr['appId'] = $order['appid'];
		$arr['nonceStr'] = $order['nonce_str'];
		$arr['package'] = "prepay_id=".$order['prepay_id'];
		$arr['signType'] = "MD5";
		$arr['timeStamp'] = (string)time();
		$str = $this->ToUrlParams($arr);
		$jmstr = $str."&key=".\WxPayConfig::KEY;
		$arr['paySign'] = strtoupper(MD5($jmstr));
		echo json_encode(array('status'=>1,'arr'=>$arr));
		exit();
	}

	//***************************
	//  企业展会微信支付 接口
	//***************************
	public function buyexhibition() {
		$uid = intval($_REQUEST['uid']);
		$check_user = M('user')->where('id='.intval($uid).' AND del=0')->find();
		if (!$check_user) {
			echo json_encode(array('status'=>0,'err'=>'登录状态异常.'));
			exit();
		}

		$eid = intval($_REQUEST['eid']);
		$check = M('sign_up')->where('uid='.intval($uid).' AND eid='.intval($eid))->find();
		if (!$check) {
			echo json_encode(array('status'=>0,'err'=>'报名信息错误.'));
			exit();
		}

		$check_course = M('exhibition')->where('id='.intval($eid).' AND del=0')->find();
		if (!$check_course) {
			echo json_encode(array('status'=>0,'err'=>'展会信息错误.'));
			exit();
		}

		if (intval($check_course['offtime'])<time()) {
			echo json_encode(array('status'=>0,'err'=>'已经过了报名时间了.'));
			exit();
		}

		if (intval($check['state'])==2) {
			echo json_encode(array('status'=>0,'err'=>'您的企业已报名成功.'.__LINE__));
			exit();
		}

		if (floatval($check_course['price'])<=0) {
			$up = M('sign_up')->where('uid='.intval($uid).' AND eid='.intval($eid))->save(array('state'=>2));
			if ($up) {
				echo json_encode(array('status'=>0,'err'=>'您的企业已报名成功.'.__LINE__));
				exit();
			}else {
				echo json_encode(array('status'=>0,'err'=>'网络异常，请稍后再试.'.__LINE__));
				exit();
			}
		}

		//下单
		$data = array();
		$data['uid']=intval($uid);
		$data['addtime']=time();
		$data['del']=0; 
		$data['type']='weixin';
		//订单状态 10未付款20代发货30确认收货（待收货）40交易关闭50交易完成
		$data['status']=10;//未付款
		$data['product_num']=intval(1);
		/*******解决屠涂同一订单重复支付问题 lisa**********/
		$data['order_sn'] = $this->build_order_no();//生成唯一订单号

		$data['order_type'] = 3;
		$oprice = floatval($check_course['price']);

		$data['price']=floatval($oprice);
	    $data['amount']=floatval($oprice);

		$result = M('order')->add($data);
		if(!$result){
			echo json_encode(array('status'=>0,'err'=>'下单失败.'));
			exit();
		}

		//添加产品订单表
		$date = array();
		$date['pid'] = $eid;
		$date['order_id'] = $result;
		$date['name'] = $check_course['title'];
		$date['price'] = $data['amount'];
		$date['photo_x'] = $check_course['photo'];
		$date['num'] = 1;
		$date['addtime'] = time();
		$res = M('order_product')->add($date);
		if(!$res){
			echo json_encode(array('status'=>0,'err'=>'下单失败.'.__LINE__));
			exit();
		}

		//①、获取用户openid
		$tools = new \JsApiPay();
		$openId = M('user')->where('id='.intval($uid))->getField('openid');
		if (!$openId) {
			echo json_encode(array('status'=>0,'err'=>'用户状态异常！'));
			exit();
		}

		$desc = $check_course['title'].'_'.trim($data['order_sn']);

		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($desc);
		$input->SetAttach($desc);
		$input->SetOut_trade_no(trim($data['order_sn']));
		$input->SetTotal_fee(floatval($data['amount'])*100);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 3600));
		$input->SetGoods_tag($desc);
		$input->SetNotify_url('https://gzleren.com/miniweddingcybl/index.php/Api/Wxpay/notify');
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);
		//echo '<font color="#f00"><b>统一下单支付单信息</b></font><br/>';
		//printf_info($order);
		$arr = array();
		$arr['appId'] = $order['appid'];
		$arr['nonceStr'] = $order['nonce_str'];
		$arr['package'] = "prepay_id=".$order['prepay_id'];
		$arr['signType'] = "MD5";
		$arr['timeStamp'] = (string)time();
		$str = $this->ToUrlParams($arr);
		$jmstr = $str."&key=".\WxPayConfig::KEY;
		$arr['paySign'] = strtoupper(MD5($jmstr));
		echo json_encode(array('status'=>1,'arr'=>$arr));
		exit();
	}

	//***************************
	//  开通会员支付 接口
	//***************************
	public function openuser () {
		$uid = intval($_REQUEST['uid']);
		$check_user = M('user')->where('id='.intval($uid).' AND del=0')->find();
		if (!$check_user) {
			echo json_encode(array('status'=>0,'err'=>'登录状态异常.'));
			exit();
		}

		$utype = intval($_REQUEST['utype']);
		$check = M('userinfo_log')->where('uid='.intval($uid))->find();
		if (!$check) {
			echo json_encode(array('status'=>0,'err'=>'会员信息异常.'));
			exit();
		}

		$level_info = M('user_level')->where('id='.intval($utype))->find();

		//下单
		$data = array();
		$data['uid']=intval($uid);
		$data['addtime']=time();
		$data['del']=0; 
		$data['type']='weixin';
		//订单状态 10未付款20代发货30确认收货（待收货）40交易关闭50交易完成
		$data['status']=10;//未付款
		$data['product_num']=intval(1);
		/*******解决屠涂同一订单重复支付问题 lisa**********/
		$data['order_sn'] = $this->build_order_no();//生成唯一订单号

		$data['order_type'] = 4;
		$oprice = floatval($level_info['price']);

		$data['price']=floatval($oprice);
	    $data['amount']=floatval($oprice);

		$result = M('order')->add($data);
		if(!$result){
			echo json_encode(array('status'=>0,'err'=>'下单失败.'));
			exit();
		}

		//添加产品订单表
		$date = array();
		$date['pid'] = $utype;
		$date['order_id'] = $result;
		$date['name'] = $level_info['name'].'开通';
		$date['price'] = $data['amount'];
		$date['photo_x'] = '';
		$date['num'] = 1;
		$date['addtime'] = time();
		$res = M('order_product')->add($date);
		if(!$res){
			echo json_encode(array('status'=>0,'err'=>'下单失败.'.__LINE__));
			exit();
		}

		//①、获取用户openid
		$tools = new \JsApiPay();
		$openId = M('user')->where('id='.intval($uid))->getField('openid');
		if (!$openId) {
			echo json_encode(array('status'=>0,'err'=>'用户状态异常！'));
			exit();
		}

		$desc = $level_info['name'].'开通_'.trim($data['order_sn']);

		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($desc);
		$input->SetAttach($desc);
		$input->SetOut_trade_no(trim($data['order_sn']));
		$input->SetTotal_fee(floatval($data['amount'])*100);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 3600));
		$input->SetGoods_tag($desc);
		$input->SetNotify_url('https://gzleren.com/miniweddingcybl/index.php/Api/Wxpay/notify');
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);
		//echo '<font color="#f00"><b>统一下单支付单信息</b></font><br/>';
		//printf_info($order);
		$arr = array();
		$arr['appId'] = $order['appid'];
		$arr['nonceStr'] = $order['nonce_str'];
		$arr['package'] = "prepay_id=".$order['prepay_id'];
		$arr['signType'] = "MD5";
		$arr['timeStamp'] = (string)time();
		$str = $this->ToUrlParams($arr);
		$jmstr = $str."&key=".\WxPayConfig::KEY;
		$arr['paySign'] = strtoupper(MD5($jmstr));
		echo json_encode(array('status'=>1,'arr'=>$arr));
		exit();
	}

	//***************************
	//  支付回调 接口
	//***************************
	public function notify(){
		/*$notify = new \PayNotifyCallBack();
		$notify->Handle(false);*/

		$res_xml = file_get_contents("php://input");
		libxml_disable_entity_loader(true);
		$ret = json_decode(json_encode(simplexml_load_string($res_xml,'simpleXMLElement',LIBXML_NOCDATA)),true);

		$path = "./Data/log/";
		if (!is_dir($path)){
			mkdir($path,0777);  // 创建文件夹test,并给777的权限（所有权限）
		}
		$content = date("Y-m-d H:i:s").'=>'.json_encode($ret);  // 写入的内容
		$file = $path."weixin_".date("Ymd").".log";    // 写入的文件
		file_put_contents($file,$content,FILE_APPEND);  // 最简单的快速的以追加的方式写入写入方法，

		$data = array();
		$data['order_sn'] = $ret['out_trade_no'];
		$data['pay_type'] = 'weixin';
		$data['trade_no'] = $ret['transaction_id'];
		$data['total_fee'] = $ret['total_fee'];
		$result = $this->orderhandle($data);
		if (is_array($result)) {
			$xml = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg>";
			$xml.="</xml>";
			echo $xml;
		}else{
			$contents = 'error => '.json_encode($result);  // 写入的内容
			$files = $path."error_".date("Ymd").".log";    // 写入的文件
			file_put_contents($files,$contents,FILE_APPEND);  // 最简单的快速的以追加的方式写入写入方法，
			echo 'fail';
		}
	}

	//***************************
	//  订单处理 接口
	//***************************
	public function orderhandle($data){
		$order_sn = trim($data['order_sn']);
		$pay_type = trim($data['pay_type']);
		$trade_no = trim($data['trade_no']);
		$total_fee = floatval($data['total_fee']);
		$check_info = M('order')->where('order_sn="'.$order_sn.'"')->find();
		if (!$check_info) {
			return "订单信息错误...";
		}

		if ($check_info['status']<10 || $check_info['back']>'0') {
			return "订单异常...";
		}

		if ($check_info['status']>10) {
			return array('status'=>1,'data'=>$data);
		}

		$up = array();
		$up['type'] = $pay_type;
		$up['price_h'] = sprintf("%.2f",floatval($total_fee/100));
		$up['status'] = 20;
		$up['trade_no'] = $trade_no;
		$res = M('order')->where('order_sn="'.$order_sn.'"')->save($up);
		if ($res) {
			//处理优惠券
			if (intval($check_info['vid'])) {
				$vou_info = M('user_voucher')->where('uid='.intval($check_info['uid']).' AND vid='.intval($check_info['vid']))->find();
				if (intval($vou_info['status'])==1) {
					M('user_voucher')->where('id='.intval($vou_info['id']))->save(array('status'=>2));
				}
			}
			$ptype = intval($check_info['order_type']);
			//公共ID
			$id = M('order_product')->where('order_id='.intval($check_info['id']))->getField('pid');
			if ($ptype==2) {
				//课程订单
				M('user_course')->where('course_id='.intval($id).' AND uid='.intval($check_info['uid']))->save(array('state'=>2));

			}elseif ($ptype==3) {
				//展会订单，修改会员报名状态
				M('sign_up')->where('uid='.intval($check_info['uid']).' AND eid='.intval($id))->save(array('state'=>2));

			}elseif ($ptype==4) {
				//修改会员 类型
				$up_type = M('order_product')->where('order_id='.intval($check_info['id']))->getField('pid');
				M('user')->where('id='.intval($check_info['uid']))->save(array('type'=>intval($up_type)));
				M('userinfo_log')->where('uid='.intval($check_info['uid']))->save(array('pay_state'=>1));
			}
			return array('status'=>1,'data'=>$data);
		}else{
			return '订单处理失败...';
		}
	}

	//构建字符串
	private function ToUrlParams($urlObj)
	{
		$buff = "";
		foreach ($urlObj as $k => $v)
		{
			if($k != "sign"){
				$buff .= $k . "=" . $v . "&";
			}
		}
		
		$buff = trim($buff, "&");
		return $buff;
	}

	/**针对涂屠生成唯一订单号
	*@return int 返回16位的唯一订单号
	*/
	public function build_order_no(){
		return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
	}
}
?>