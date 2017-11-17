<?php
namespace Ht\Controller;
use Think\Controller;
class JoinController extends PublicController{

	/*
	* 获取、查询所有待审核商家
	*/
	public function index(){
		//搜索
		//构建搜索条件
		$condition = array();
		$where = '1=1 AND audit!=1';

		//分页
		$count = M('exshop')->where($where)->count();// 查询满足要求的总记录数
		$Page  = new \Think\Page($count,25);// 实例化分页类 传入总记录数和每页显示的记录数(25)

		//分页跳转的时候保证查询条件
		foreach($condition as $key=>$val) {
			$Page->parameter[$key]  =  urlencode($val);
		}

		//头部描述信息，默认值 “共 %TOTAL_ROW% 条记录”
		$Page->setConfig('header', '<li class="rows">共<b>%TOTAL_ROW%</b>条&nbsp;第<b>%NOW_PAGE%</b>页/共<b>%TOTAL_PAGE%</b>页</li>');
		//上一页描述信息
	    $Page->setConfig('prev', '上一页');
	    //下一页描述信息
	    $Page->setConfig('next', '下一页');
	    //首页描述信息
	    $Page->setConfig('first', '首页');
	    //末页描述信息
	    $Page->setConfig('last', '末页');
	    /*
	    * 分页主题描述信息 
	    * %FIRST%  表示第一页的链接显示  
	    * %UP_PAGE%  表示上一页的链接显示   
	    * %LINK_PAGE%  表示分页的链接显示
	    * %DOWN_PAGE% 	表示下一页的链接显示
	    * %END%   表示最后一页的链接显示
	    */
	    $Page->setConfig('theme', '%FIRST%%UP_PAGE%%LINK_PAGE%%DOWN_PAGE%%END%%HEADER%');

		$show    = $Page->show();// 分页显示输出
		// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
		$list = M('exshop')->where($where)->order('addtime desc')->limit($Page->firstRow.','.$Page->listRows)->select();
		foreach ($list as $k => $v) {
			$list[$k]['addtime'] = date("Y-m-d H:i",$v['addtime']);
			$list[$k]['u_name'] = M('user')->where('id='.intval($v['uid']))->getField('name');
		}
		//echo $where;
		$this->assign('list',$list);// 赋值数据集
		$this->assign('page',$show);// 赋值分页输出
		$this->display(); // 输出模板

	}

	/*
	* 获取、查询所有已审核商家
	*/
	public function audited(){
		//搜索
		//构建搜索条件
		$condition = array();
		$where = '1=1 AND audit=1';

		//分页
		$count = M('exshop')->where($where)->count();// 查询满足要求的总记录数
		$Page  = new \Think\Page($count,25);// 实例化分页类 传入总记录数和每页显示的记录数(25)

		//分页跳转的时候保证查询条件
		foreach($condition as $key=>$val) {
			$Page->parameter[$key]  =  urlencode($val);
		}

		//头部描述信息，默认值 “共 %TOTAL_ROW% 条记录”
		$Page->setConfig('header', '<li class="rows">共<b>%TOTAL_ROW%</b>条&nbsp;第<b>%NOW_PAGE%</b>页/共<b>%TOTAL_PAGE%</b>页</li>');
		//上一页描述信息
	    $Page->setConfig('prev', '上一页');
	    //下一页描述信息
	    $Page->setConfig('next', '下一页');
	    //首页描述信息
	    $Page->setConfig('first', '首页');
	    //末页描述信息
	    $Page->setConfig('last', '末页');
	    /*
	    * 分页主题描述信息 
	    * %FIRST%  表示第一页的链接显示  
	    * %UP_PAGE%  表示上一页的链接显示   
	    * %LINK_PAGE%  表示分页的链接显示
	    * %DOWN_PAGE% 	表示下一页的链接显示
	    * %END%   表示最后一页的链接显示
	    */
	    $Page->setConfig('theme', '%FIRST%%UP_PAGE%%LINK_PAGE%%DOWN_PAGE%%END%%HEADER%');

		$show    = $Page->show();// 分页显示输出
		// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
		$list = M('exshop')->where($where)->order('addtime desc')->limit($Page->firstRow.','.$Page->listRows)->select();
		foreach ($list as $k => $v) {
			$list[$k]['addtime'] = date("Y-m-d H:i",$v['addtime']);
			$list[$k]['u_name'] = M('user')->where('id='.intval($v['uid']))->getField('name');
		}
		//echo $where;
		$this->assign('list',$list);// 赋值数据集
		$this->assign('page',$show);// 赋值分页输出
		$this->display(); // 输出模板

	}

	/*
	*
	* 查看订单详情
	*/
	public function show(){
		//获取传递过来的id
		$id = intval($_REQUEST['id']);
		if(!$id) {
			$this->error('系统错误.');
			exit();
		}

		//根据订单id获取订单数据还有商品信息
		$info = M('exshop')->where('id='.intval($id))->find();
		if (!$info) {
			$this->error('体验店信息异常.');
			exit();
		}
		
		$info['addtime'] = date("Y-m-d H:i",$info['addtime']);
		$info['cname'] = M('user')->where('id='.intval($info))->getField('name');

		$this->assign('info',$info);
		$this->display();
	}

	//*************************
	// 企业会员 审核
	//*************************
	public function shenhe(){
		$id = intval($_POST['id']);
		$check = M('exshop')->where('id='.intval($id))->find();
		if (!$check) {
			$this->error('体验店信息异常！');
			exit();
		}

		$audit = intval($_POST['audit']);
		$reason = trim($_POST['reason']);
		if (!$reason) {
			$reason = '无';
		}

		$up = array();
		$up['audit'] = $audit;
		$up['reason'] = $reason;
		$res = M('exshop')->where('id='.intval($id))->save($up);
		if ($res) {
			if ($audit==1) {
				//认证成功就把数据添加到商家表
			    $array=array(
					'name' => $check['name'] ,
					'tid' => intval($check['tid']),
					'uname' => $check['uname'] ,
					'address' => $check['address'] ,
					'address_xq' => $check['address'] ,
					'tel' => $check['tel'] ,
					'updatetime' => time() ,
					'status' => 1 ,
			    );

			    $jwd = $this->getlnglat(trim($check['address']));
			    if ($jwd['lat']) {
			    	$array['location_x'] = $jwd['lat'];
			    } else {
			    	$array['location_x'] = 0;
			    }

			    if ($jwd['lng']) {
			    	$array['location_y'] = $jwd['lng'];
			    } else {
			    	$array['location_y'] = 0;
			    }

			    if(intval($check['shop_id'])>0){
				  	//将空数据排除掉，防止将原有数据空置
					foreach ($array as $k => $v) {
					  	if(empty($v)){
					  	 	unset($v);
					  	}
					}
					$upres =M('shangchang')->where('id='.intval($check['shop_id']))->save($array);
			    }else{
				    $array['addtime']=time();
				    $upres =M('shangchang')->add($array);
				    $shop_id = $upres;
			    }

			    if (!$upres) {
			    	M('exshop')->where('id='.intval($id))->save(array('audit'=>0,'reason'=>'无'));
			    	$this->error('操作失败！'.__LINE__);
					exit();
			    }

			    if (intval($shop_id)>0) {
			    	M('exshop')->where('id='.intval($id))->save(array('shop_id'=>intval($shop_id)));
			    }
			} 

			$this->success('操作成功！');
			exit();
		}else{
			$this->error('操作失败！');
			exit();
		}
	}

	/*
	*
	*  点击查看图片
	*/
	public function getimg(){
		$type = intval($_REQUEST['type']);
		$shop_id = intval($_REQUEST['shop_id']);
		if ($type == 1) {
			//身份证正面照
			$img = M('exshop')->where('id='.intval($shop_id))->getField('zheng');
		}elseif ($type==2) {
			//身份证反面照
			$img = M('exshop')->where('id='.intval($shop_id))->getField('fan');
		}elseif ($type==3) {
			//营业执照
			$img = M('exshop')->where('id='.intval($shop_id))->getField('yyzz');
		}elseif ($type==4) {
			//店铺门头照
			$img = M('exshop')->where('id='.intval($shop_id))->getField('dianmian');
		}
		$this->assign('img',$img);
		$this->display();
	}

	/*
	*
	*  订单删除方法
	*/
	public function del(){
		//以后删除还要加权限登录判断
		$id = intval($_GET['did']);
		$check_info = $this->order->where('id='.intval($id))->find();
		if (!$check_info) {
			$this->error('系统错误，请稍后再试.');
		}

		$up = array();
		$up['del'] = 1;
		$res = $this->order->where('id='.intval($id))->save($up);
		if ($res) {
			$this->success('操作成功.');
		}else{
			$this->error('操作失败.');
		}
	}

	/*
	*
	*  腾讯逆地址解析获取经纬度 方法
	*/
	public function getlnglat($adds){
		$get_token_url = 'http://apis.map.qq.com/ws/geocoder/v1/?address='.$adds.'&key=3F4BZ-6RBR6-Q3HSQ-ML5JH-KF22H-YTBRQ';
		$ch = curl_init();
		curl_setopt($ch,CURLOPT_URL,$get_token_url);
		curl_setopt($ch,CURLOPT_HEADER,0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
		$res = curl_exec($ch);  
		curl_close($ch);

		$arr = json_decode($res,true);
		$lnglat = array();
		$lnglat['lng'] = $arr['result']['location']['lng'];
		$lnglat['lat'] = $arr['result']['location']['lat'];
		return $lnglat;
	}

}