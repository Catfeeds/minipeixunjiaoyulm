<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class UserController extends PublicController {

	//***************************
	//  获取用户订单数量
	//***************************
	public function getorder(){
		$uid = intval($_REQUEST['userId']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'非法操作.'));
			exit();
		}

		$order = array();
		$order['pay_num'] = intval(M('order')->where('uid='.intval($uid).' AND status=10 AND del=0 AND order_type=1')->getField('COUNT(id)'));
		$order['rec_num'] = intval(M('order')->where('uid='.intval($uid).' AND status=30 AND del=0 AND back="0" AND order_type=1')->getField('COUNT(id)'));
		$order['finish_num'] = intval(M('order')->where('uid='.intval($uid).' AND status>30 AND del=0 AND back="0" AND order_type=1')->getField('COUNT(id)'));
		$order['refund_num'] = intval(M('order')->where('uid='.intval($uid).' AND back>"0" AND order_type=1')->getField('COUNT(id)'));
		echo json_encode(array('status'=>1,'orderInfo'=>$order));
		exit();
	}

	//***************************
	//  获取用户信息
	//***************************
	public function userinfo(){
		/*if (!$_SESSION['ID']) {
			echo json_encode(array('status'=>4));
			exit();
		}*/
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'非法操作.'));
			exit();
		}

		$user = M("user")->where('id='.intval($uid))->field('id,name,uname,photo,tel')->find();
		if ($user['photo']) {
			if ($user['source']=='') {
				$user['photo'] = __DATAURL__.$user['photo'];
			}
		}else{
			$user['photo'] = __PUBLICURL__.'home/images/moren.png';
		}

		$user['tel'] = substr_replace($user['tel'],'****',3,4);
		echo json_encode(array('status'=>1,'userinfo'=>$user));
		exit();
	}

	//***************************
	//  获取单身用户信息
	//***************************
	public function getdaninfo(){
		$id = intval($_REQUEST['id']);
		$info = M('userinfo_log')->where('id='.intval($id).' AND state=1 AND pay_state=1')->find();
		if (!$info) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}

		//$info['tel'] = substr_replace($info['tel'],'****',3,4);
		$info['uname'] = M('user')->where('id='.intval($info['uid']))->getField('name');
		//城市
		$info['cityname'] = M('china_city')->where('id='.intval($info['city']))->getField('name');
		//会员类型
		$info['utype'] = M('user_level')->where('id='.intval($info['utype']))->getField('name');

		echo json_encode(array('status'=>1,'info'=>$info));
		exit();
		
	}

	//***************************
	//  用户 交友入驻
	//***************************
	public function getinfo() {
		//所有省份
        $china_city=M("china_city");
        $province = $china_city->where('tid=0')->field('id,name')->select();

        //所有会员级别
        $list = M('user_level')->where('1=1')->select();
        foreach ($list as $k => $v) {
            if (floatval($v['price'])>0) {
                $list[$k]['name'] = $v['name'].'('.floatval($v['price']).'元)';
            }else{
                $list[$k]['name'] = $v['name'].'(免费)';
            }
        }

        // $info = M('userinfo_log')->where('uid='.intval($_REQUEST['uid']))->find();
        // $info['photo'] = __DATAURL__.$info['photo'];
        // $info['zheng'] = __DATAURL__.$info['zheng'];
        // $info['fan'] = __DATAURL__.$info['fan'];

        echo json_encode(array('status'=>1,'province'=>$province,'list'=>$list,'date'=>date("Y-m-d")));
        exit();
	}

	//***************************
	//  用户 保存会员信息
	//***************************
	public function saveinfo() {
		$uid = intval($_POST['uid']);
        if (!$uid) {
            echo json_encode(array('status'=>0,'err'=>'用户状态异常！'));
            exit();
        }

        $utype = intval($_POST['utype']);
        if (!$utype) {
            echo json_encode(array('status'=>0,'err'=>'请选择会员类型！'));
            exit();
        }

        $checkinfo = M('userinfo_log')->where('uid='.intval($uid).' AND pay_state=1')->find();
        if ($checkinfo) {
            echo json_encode(array('status'=>0,'err'=>'您已经开通平台会员，无需再提交！'));
            exit();
        }

        $data = array();
        $data['uid'] = $uid;
        $data['truename'] = trim($_POST['truename']);
        $data['sex'] = intval($_POST['sex']);
        $data['birthday'] = intval($_POST['birthday']);
        $data['photo'] = trim($_POST['photo']);
        $data['city'] = intval($_POST['city']);
        $data['hy'] = intval($_POST['hy']);
        $data['sg'] = trim($_POST['sg']);
        $data['xl'] = trim($_POST['xl']);
        $data['yx'] = trim($_POST['yx']);
        $data['qq'] = trim($_POST['qq']);
        $data['email'] = trim($_POST['email']);
        $data['weixin'] = trim($_POST['weixin']);
        $data['tel'] = trim($_POST['tel']);
        $data['address'] = trim($_POST['address']);
        $data['lxdx'] = $_POST['lxdx'];
        $data['intro'] = $_POST['intro'];
        $data['zheng'] = $_POST['zheng'];
        $data['fan'] = $_POST['fan'];
        $data['utype'] = $utype;
        $data['addtime'] = time();

        $userinfo_log = M('userinfo_log');
        $check = $userinfo_log->where('uid='.intval($uid))->find();
        if ($check) {
        	$res = $userinfo_log->where('id='.intval($check['id']))->save($data);
        } else {
        	$res = $userinfo_log->add($data);
        }

        if ($res) {
            echo json_encode(array('status'=>1));
            exit();
        }else{
            echo json_encode(array('status'=>0,'err'=>'操作失败，请稍后再试！'));
            exit();
        }
	}

	//***************************
	//  修改用户信息
	//***************************
	public function user_edit(){
			$time=mktime();
			$arr=$_POST['photo'];		
			if($_POST['photo']!=''){
				$data['photo'] =$arr;
			}

			$user_id=intval($_REQUEST['user_id']);
			$old_pwd=$_REQUEST['old_pwd'];
			$pwd=$_REQUEST['new_pwd'];
			$old_tel=$_REQUEST['old_tel'];
			$uname=$_REQUEST['uname'];
			$tel=$_REQUEST['new_tel'];

			$user_info = M('user')->where('id='.intval($user_id).' AND del=0')->find();
			if (!$user_info) {
				echo json_encode(array('status'=>0,'err'=>'会员信息错误.'));
				exit();
			}

			//用户密码检测
			$data = array();
			if ($pwd) {
				$data['pwd'] = md5(md5($pwd));
				if ($user_info['pwd'] && md5(md5($old_pwd))!==$user_info['pwd']) {
					echo json_encode(array('status'=>0,'err'=>'旧密码不正确.'));
					exit();
				}
			}

			//用户手机号检测
			if ($tel) {
				if ($user_info['tel'] && $old_tel!==$user_info['tel']) {
					echo json_encode(array('status'=>0,'err'=>'原手机号不正确.'));
					exit();
				}
				$check_tel = M('user')->where('tel='.trim($tel).' AND del=0')->count();
				if ($check_tel) {
					echo json_encode(array('status'=>0,'err'=>'新手机号已存在.'));
					exit();
				}
				$data['tel'] = trim($tel);
			}

			if ($uname && $uname!==$user_info['uname']) {
				$data['uname'] = trim($uname);
			}

			if (!$data) {
				echo json_encode(array('status'=>0,'err'=>'您没有输入要修改的信息.'.__LINE__));
				exit();
			}
			//dump($data);exit;
			$result=M("user")->where('id='.intval($user_id))->save($data);
			//echo M("aaa_pts_user")->_sql();exit;
		    if($result){
				echo json_encode(array('status'=>1));
				exit();
			}else{
				echo json_encode(array('status'=>0,'err'=>'操作失败.'));
				exit();
			}
	}

	//***************************
	//  用户商品收藏信息
	//***************************
	public function collection(){
		$user_id = intval($_REQUEST['id']);
		if (!$user_id) {
			echo json_encode(array('status'=>0,'err'=>'系统错误，请稍后再试.'));
			exit();
		}

		$pro_sc = M('product_sc');
		
		$sc_list = $pro_sc->where('uid='.intval($user_id))->order('id desc')->select();
		foreach ($sc_list as $k => $v) {
			$pro_info = M('product')->where('id='.intval($v['pid']).' AND del=0 AND is_down=0')->find();
			if ($pro_info) {
				$sc_list[$k]['pro_name'] = $pro_info['name'];
				$sc_list[$k]['photo'] = __DATAURL__.$pro_info['photo_x'];
				$sc_list[$k]['price_yh'] = sprintf("%.2f",$pro_info['price_yh']);
			}else{
				$pro_sc->where('id='.intval($v['id']))->delete();
			}
		}

		echo json_encode(array('status'=>1,'sc_list'=>$sc_list));
		exit();
	}


	//***************************
	//  用户单个商品取消收藏
	//***************************
	public function collection_qu(){
	    $sc_id = intval($_REQUEST['id']);
    	if (!$sc_id) {
    		echo json_encode(array('status'=>0,'err'=>'非法操作.'));
    		exit();
    	}

		$product=M("product_sc");
	    $ress = $product->where('id ='.intval($sc_id))->delete(); 
	   //echo $shangchang->_sql();
		if($ress){
		    echo json_encode(array('status'=>1));
		    exit();
		}else{
		    echo json_encode(array('status'=>0,'err'=>'网络异常！'.__LINE__));
		    exit();
	    }
	}

	//***************************
	//  保存会员的心得信息
	//***************************
	public function info(){
		$uid = intval($_REQUEST['uid']);
		$user = M("user")->where('id='.intval($uid).' AND del=0')->find();
		if (!$user) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}

		$content = $_POST['content'];
		if (!$content) {
			echo json_encode(array('status'=>0,'err'=>'请输入个人信息介绍.'));
			exit();
		}

		$adv_img = '';
		$img1 = trim($_REQUEST['adv1']);
		if ($img1) {
			$adv_img .= ','.$img1;
		}
		$img2 = trim($_REQUEST['adv2']);
		if ($img2) {
			$adv_img .= ','.$img2;
		}
		$img3 = trim($_REQUEST['adv3']);
		if ($img3) {
			$adv_img .= ','.$img3;
		}

		$data = array();
		$data['uid'] = $uid;
		$data['content'] = $content;
		$data['adv_img'] = $adv_img;
		$data['addtime'] = time();
		$res = M('user_info')->add($data);
		if ($res) {
			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'保存失败.'));
			exit();
		}
	}

	//***************************
	//  获取所有会员列表
	//***************************
	public function info_list(){
 		$list = M('user_info')->where('1=1 AND state=2')->order('addtime desc')->select();
 		foreach ($list as $k => $v) {
 			$list[$k]['avatar'] = M('user')->where('id='.intval($v['uid']))->getField('photo');
 			$list[$k]['uname'] = M('user')->where('id='.intval($v['uid']))->getField('name');

 			//处理时间
 			$timenum = intval(time()-$v['addtime']);
            $tian = ceil($timenum/86400);
            $xiaoshi = ceil($timenum/3600);
            $fenzhong = ceil($timenum/60);
            if (intval($tian)>1) {
                if (intval($tian)>7) {
                    $list[$k]['desc'] = date("m-d",$v['addtime']);
                }else{
                    $list[$k]['desc'] = intval($tian).'天前';
                }
            }elseif (intval($xiaoshi)>0) {
                $list[$k]['desc'] = intval($xiaoshi).'小时前';
            }elseif (intval($fenzhong)>0) {
                $list[$k]['desc'] = intval($fenzhong).'分钟前';
            }else{
                $list[$k]['desc'] = intval($timenum).'秒前';
            }
            //处理图片
            $imgarr = explode(',', trim($v['adv_img'],','));
            if ($imgarr[0]) {
            	$list[$k]['adv1'] = __DATAURL__.$imgarr[0];
            }
            if ($imgarr[1]) {
            	$list[$k]['adv2'] = __DATAURL__.$imgarr[1];
            }
            if ($imgarr[2]) {
            	$list[$k]['adv3'] = __DATAURL__.$imgarr[2];
            }
 		}

 		//获取所有单身狗信息
 		$dan = M('userinfo_log')->where('1=1 AND state=1 AND pay_state=1')->field('id,uid,photo,sex,city,birthday,xl,intro,utype')->select();
 		foreach ($dan as $k => $v) {
 			$dan[$k]['photo'] = __DATAURL__.$v['photo'];
 			$dan[$k]['uname'] = M('user')->where('id='.intval($v['uid']))->getField('name');
 			$cityname = M('china_city')->where('id='.intval($v['city']))->getField('name');
 			//去除省，市，区
 			$dan[$k]['cityname'] = $this->deal_str($cityname);
 		}

 		//判断登录用户性别
 		$sex = M('userinfo_log')->where('uid='.intval($_REQUEST['uid']))->getField('sex');
 		if (intval($sex)==0) {
 			$sex = M('user')->where('id='.intval($_REQUEST['uid']))->getField('sex');
 		}

 		$c_sex = 2;
 		if (intval($sex)>0) {
 			$c_sex = intval($sex)==1 ? 2 : 1;
 		}

 		//获取所有 同城异性
 		$dan_yi = M('userinfo_log')->where('state=1 AND pay_state=1 AND sex='.intval($c_sex).' AND city='.intval($_REQUEST['city']))->field('id,uid,photo,sex,city,birthday,xl,intro,utype')->select();
 		foreach ($dan_yi as $k => $v) {
 			$dan_yi[$k]['photo'] = __DATAURL__.$v['photo'];
 			$dan_yi[$k]['uname'] = M('user')->where('id='.intval($v['uid']))->getField('name');
 			$cityname = M('china_city')->where('id='.intval($v['city']))->getField('name');
 			//去除省，市，区
 			$dan_yi[$k]['cityname'] = $this->deal_str($cityname);
 		}

 		//获取所有省份
 		$province = M('china_city')->where('tid=0')->field('id,name')->select();

 		echo json_encode(array('status'=>1,'list'=>$list,'dan'=>$dan,'yi'=>$dan_yi,'prov'=>$province));
 		exit();
	}

	//***************************
	// 加载更多 首页交友
	//***************************
	public function loadmoredan() {
		$page = intval($_POST['page']);
 		if (!$page) {
 			$page = 2;
 		}
 		$limit = intval($page*8)-8;

 		$sex = intval($_POST['sex']);
 		//搜索
 		$where = 'state=1 AND pay_state=1';
 		if ($sex>0) {
 			$where .= ' AND sex='.intval($sex);
 		}

 		$age1 = intval($_REQUEST['age1']);
 		$age2 = intval($_REQUEST['age2']);
 		if ($age1>0) {
 			$where .= ' AND birthday>='.intval($age1);
 		}
 		if ($age2>0) {
 			$where .= ' AND birthday<'.intval($age2);
 		}

 		$city = intval($_REQUEST['city']);
 		if ($city>0) {
 			$where .= ' AND city='.intval($city);
 		}

 		$hy = intval($_REQUEST['hy']);
 		if ($hy>0) {
 			$where .= ' AND hy='.intval($hy);
 		}

 		//获取所有单身狗信息
 		$dan = M('userinfo_log')->where($where)->field('id,uid,photo,sex,city,birthday,xl,intro,utype')->limit($limit.',8')->select();
 		foreach ($dan as $k => $v) {
 			$dan[$k]['photo'] = __DATAURL__.$v['photo'];
 			$dan[$k]['uname'] = M('user')->where('id='.intval($v['uid']))->getField('name');
 			$cityname = M('china_city')->where('id='.intval($v['city']))->getField('name');
 			//去除省，市，区
 			$dan[$k]['cityname'] = $this->deal_str($cityname);
 		}

 		echo json_encode(array('status'=>1,'dan'=>$dan));
 		exit();
	}

	//***************************
	// 加载更多 心情日记
	//***************************
	public function loadmorelist() {
		$page = intval($_POST['page']);
 		if (!$page) {
 			$page = 2;
 		}
 		$limit = intval($page*8)-8;

 		$list = M('user_info')->where('1=1 AND state=2')->order('addtime desc')->limit($limit.',8')->select();
 		foreach ($list as $k => $v) {
 			$list[$k]['avatar'] = M('user')->where('id='.intval($v['uid']))->getField('photo');
 			$list[$k]['uname'] = M('user')->where('id='.intval($v['uid']))->getField('name');

 			//处理时间
 			$timenum = intval(time()-$v['addtime']);
            $tian = ceil($timenum/86400);
            $xiaoshi = ceil($timenum/3600);
            $fenzhong = ceil($timenum/60);
            if (intval($tian)>1) {
                if (intval($tian)>7) {
                    $list[$k]['desc'] = date("m-d",$v['addtime']);
                }else{
                    $list[$k]['desc'] = intval($tian).'天前';
                }
            }elseif (intval($xiaoshi)>0) {
                $list[$k]['desc'] = intval($xiaoshi).'小时前';
            }elseif (intval($fenzhong)>0) {
                $list[$k]['desc'] = intval($fenzhong).'分钟前';
            }else{
                $list[$k]['desc'] = intval($timenum).'秒前';
            }
            //处理图片
            $imgarr = explode(',', trim($v['adv_img'],','));
            if ($imgarr[0]) {
            	$list[$k]['adv1'] = __DATAURL__.$imgarr[0];
            }
            if ($imgarr[1]) {
            	$list[$k]['adv2'] = __DATAURL__.$imgarr[1];
            }
            if ($imgarr[2]) {
            	$list[$k]['adv3'] = __DATAURL__.$imgarr[2];
            }
 		}

 		echo json_encode(array('status'=>1,'list'=>$list));
 		exit();
	}

	//***************************
	// 加载更多 同城异性
	//***************************
	public function loadmoreyi() {
		$page = intval($_POST['page']);
 		if (!$page) {
 			$page = 2;
 		}
 		$limit = intval($page*8)-8;

 		//判断登录用户性别
 		$sex = M('userinfo_log')->where('uid='.intval($_REQUEST['uid']))->getField('sex');
 		if (intval($sex)==0) {
 			$sex = M('user')->where('id='.intval($_REQUEST['uid']))->getField('sex');
 		}

 		$c_sex = 2;
 		if (intval($sex)>0) {
 			$c_sex = intval($sex)==1 ? 2 : 1;
 		}

 		//获取所有 同城异性
 		$dan_yi = M('userinfo_log')->where('state=1 AND pay_state=1 AND sex='.intval($c_sex).' AND city='.intval($_REQUEST['city']))->field('id,uid,photo,sex,city,birthday,xl,intro,utype')->limit($limit.',8')->select();
 		foreach ($dan_yi as $k => $v) {
 			$dan_yi[$k]['photo'] = __DATAURL__.$v['photo'];
 			$dan_yi[$k]['uname'] = M('user')->where('id='.intval($v['uid']))->getField('name');
 			$cityname = M('china_city')->where('id='.intval($v['city']))->getField('name');
 			//去除省，市，区
 			$dan_yi[$k]['cityname'] = $this->deal_str($cityname);
 		}

 		echo json_encode(array('status'=>1,'yi'=>$dan_yi));
 		exit();
	}

	//***************************
	// 上传心得图片
	//***************************
	public function uploadimg(){
		$info = $this->upload_images($_FILES['img'],array('jpg','png','jpeg'),"userinfo/".date(Ymd));
		if(is_array($info)) {// 上传错误提示错误信息
			$url = 'UploadFiles/'.$info['savepath'].$info['savename'];
			$xt = $_REQUEST['imgs'];
			if ($xt) {
				$img_url = "Data/".$xt;
				if(file_exists($img_url)) {
					@unlink($img_url);
				}
			}
			echo $url;
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>$info));
			exit();
		}
	}

	/*
	*
	* 去除省份城市 最后的那个字
	*/
	public function deal_str($str) {
		$str = rtrim($str,'市');
		return rtrim($str,'省');
	}
		
	/*
	*
	* 图片上传的公共方法
	*  $file 文件数据流 $exts 文件类型 $path 子目录名称
	*/
	public function upload_images($file,$exts,$path){
		$upload = new \Think\Upload();// 实例化上传类
		$upload->maxSize   =  3145728 ;// 设置附件上传大小3M
		$upload->exts      =  $exts;// 设置附件上传类型
		$upload->rootPath  =  './Data/UploadFiles/'; // 设置附件上传根目录
		$upload->savePath  =  ''; // 设置附件上传（子）目录
		$upload->saveName = time().mt_rand(100000,999999); //文件名称创建时间戳+随机数
		$upload->autoSub  = true; //自动使用子目录保存上传文件 默认为true
		$upload->subName  = $path; //子目录创建方式，采用数组或者字符串方式定义
		// 上传文件 
		$info = $upload->uploadOne($file);
		if(!$info) {// 上传错误提示错误信息
		    return $upload->getError();
		}else{// 上传成功 获取上传文件信息
			//return 'UploadFiles/'.$file['savepath'].$file['savename'];
			return $info;
		}
	}

}