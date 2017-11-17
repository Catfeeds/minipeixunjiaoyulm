<?php
namespace Ht\Controller;
use Think\Controller;
class UserController extends PublicController{

	//*************************
	// 普通会员的管理
	//*************************
	public function index(){
		$aaa_pts_qx=1;
		$type=$_GET['type'];
		$id=(int)$_GET['id'];
		$tel = trim($_REQUEST['tel']);
		$name = trim($_REQUEST['name']);

		$names=$this->htmlentities_u8($_GET['name']);
		//搜索
		$where="1=1";
		$name!='' ? $where.=" and name like '%$name%'" : null;
		$tel!='' ? $where.=" and tel like '%$tel%'" : null;

		define('rows',20);
		$count=M('user')->where($where)->count();
		$rows=ceil($count/rows);

		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$userlist=M('user')->where($where)->order('id desc')->limit($limit,rows)->select();
		$page_index=$this->page_index($count,$rows,$page);
		foreach ($userlist as $k => $v) {
			$userlist[$k]['addtime']=date("Y-m-d H:i",$v['addtime']);
		}
		//====================
		// 将GET到的参数输出
		//=====================
		$this->assign('name',$name);
		$this->assign('tel',$tel);

		//=============
		//将变量输出
		//=============
		$this->assign('page_index',$page_index);
		$this->assign('page',$page);
		$this->assign('userlist',$userlist);
		$this->display();	
	}

	//*************************
	//会员专区信息审核 管理
	//*************************
	public function audit(){
		define('rows',20);
		$count=M('user_info')->where("1=1 AND state=1")->count();
		$rows=ceil($count/rows);

		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$list=M('user_info')->where("1=1 AND state=1")->order('addtime asc')->limit($limit,rows)->select();
		$page_index=$this->page_index($count,$rows,$page);

		foreach ($list as $k => $v) {
			$list[$k]['name'] = M('user')->where('id='.intval($v['uid']))->getField('name');
			$list[$k]['addtime'] = date("Y-m-d H:i",$v['addtime']);
		}
		
	    //=============
		//将变量输出
		//=============
		$this->assign('list',$list);
		$this->assign('page_index',$page_index);
		$this->assign('page',$page);
		$this->display();
	}

	//*************************
	//会员专区信息审核 管理
	//*************************
	public function audited(){
		define('rows',20);
		$count=M('user_info')->where("1=1 AND state IN (2,3)")->count();
		$rows=ceil($count/rows);

		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$list=M('user_info')->where("1=1 AND state IN (2,3)")->order('addtime asc')->limit($limit,rows)->select();
		$page_index=$this->page_index($count,$rows,$page);

		foreach ($list as $k => $v) {
			$list[$k]['name'] = M('user')->where('id='.intval($v['uid']))->getField('name');
			$list[$k]['addtime'] = date("Y-m-d H:i",$v['addtime']);
		}
		
	    //=============
		//将变量输出
		//=============
		$this->assign('list',$list);
		$this->assign('page_index',$page_index);
		$this->assign('page',$page);
		$this->display();
	}

	/*
	*
	*  点击查看图片
	*/
	public function showimg(){
		$id = intval($_REQUEST['id']);
		$adv_img = M('user_info')->where('id='.intval($id))->getField('adv_img');
		if (!$adv_img) {
			$this->error('没有找到相关图片.');
			exit();
		}

		$img = explode(',', trim($adv_img,','));
		$this->assign('img',$img);
		$this->display();
	}

	/*
	*
	*  会员信息 审核
	*/
	public function audit_edit(){
		$id = intval($_REQUEST['id']);
		$type = trim($_REQUEST['type']);
		if (!$id || !$type) {
			$this->error('参数错误.');
			exit();
		}

		$check = M('user_info')->where('id='.intval($id))->find();
		if (!$check) {
			$this->error('没有找到要审核的数据.');
			exit();
		}

		if (intval($check['state'])>1) {
			$this->error('该条数据已经审核.');
			exit();
		}

		$data = array();
		if ($type =='agree') {
			//通过审核
			$res = M('user_info')->where('id='.intval($id))->save(array('state'=>2));
		}elseif ($type =='unagree') {
			//不通过审核
			$res = M('user_info')->where('id='.intval($id))->save(array('state'=>3));
		}

		if ($res) {
			$this->success('操作成功！','audit');
			exit();
		}else{
			$this->error('操作失败！','audit');
			exit();
		}
	}

	//*************************
	//会员专区信息审核 删除
	//*************************
	public function del()
	{
		$id = intval($_REQUEST['did']);
		$info = M('user')->where('id='.intval($id))->find();
		if (!$info) {
			$this->error('会员信息错误.'.__LINE__);
			exit();
		}

		$data=array();
		$data['del'] = $info['del'] == '1' ?  0 : 1;
		$up = M('user')->where('id='.intval($id))->save($data);
		if ($up) {
			$this->redirect('User/index',array('page'=>intval($_REQUEST['page'])));
			exit();
		}else{
			$this->error('操作失败.');
			exit();
		}
	}

	//*************************
	//会员专区信息审核 删除
	//*************************
	public function delinfo()
	{
		$id = intval($_REQUEST['did']);
		$info = M('user_info')->where('id='.intval($id))->find();
		if (!$info) {
			$this->error('数据信息错误.'.__LINE__);
			exit();
		}

		if (intval($info['state'])==4) {
			$this->success('操作成功！');
			exit();
		}

		$data=array();
		$data['state'] = 4;
		$up = M('user_info')->where('id='.intval($id))->save($data);
		if ($up) {
			$this->redirect('audited',array('page'=>intval($_REQUEST['page'])));
			exit();
		}else{
			$this->error('操作失败.');
			exit();
		}
	}

	//*************************
	//会员信息管理
	//*************************	
	public function userinfo_log(){
		$tel = trim($_REQUEST['tel']);
		$name = trim($_REQUEST['name']);

		$names=$this->htmlentities_u8($_GET['name']);
		//搜索
		$where="1=1";
		$name!='' ? $where.=" and truename like '%$name%'" : null;
		$tel!='' ? $where.=" and tel like '%$tel%'" : null;

		define('rows',20);
		$count=M('userinfo_log')->where($where)->count();
		$rows=ceil($count/rows);

		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$userlist=M('userinfo_log')->where($where)->order('addtime desc')->limit($limit,rows)->select();
		$page_index=$this->page_index($count,$rows,$page);
		foreach ($userlist as $k => $v) {
			$userlist[$k]['uname'] = M('user')->where('id='.intval($v['uid']))->getField('name');
			$userlist[$k]['addtime']=date("Y-m-d H:i",$v['addtime']);
			$userlist[$k]['utype'] = M('user_level')->where('id='.intval($v['utype']))->getField('name');
		}
		//====================
		// 将GET到的参数输出
		//=====================
		$this->assign('name',$name);
		$this->assign('tel',$tel);

		//=============
		//将变量输出
		//=============
		$this->assign('page_index',$page_index);
		$this->assign('page',$page);
		$this->assign('userlist',$userlist);
		$this->display();
	}

	/*
	* 会员信息 查看修改
	*/
	public function show(){
		$id = intval($_REQUEST['id']);
		$info = M('userinfo_log')->where('id='.intval($id))->find();
		if (!$info) {
			$this->error('信息错误！');
			exit();
		}

		$this->assign('info',$info);
		$this->display();
	}

	//*************************
	//会员 禁用
	//*************************
	public function info_del()
	{
		$id = intval($_REQUEST['did']);
		$info = M('userinfo_log')->where('id='.intval($id))->find();
		if (!$info) {
			$this->error('会员信息错误.'.__LINE__);
			exit();
		}

		$up = M('userinfo_log')->where('id='.intval($id))->delete();
		if ($up) {
			$this->redirect('User/userinfo_log',array('page'=>intval($_REQUEST['page'])));
			exit();
		}else{
			$this->error('操作失败.');
			exit();
		}
	}
}