<?php

	class STREET_GAME {
		private $con;
		
		public function __construct($con) {
			$this->con = $con;
		}
		
		public function doSelect($city_index = 0) {
			if ($city_index == 0) {
				$sql = "select * from cityscape_join.shanghai_outring_50m_game OFFSET floor(random()*10000) LIMIT 13;";
			}else {
				$sql = "select * from cityscape_join.beijing_5ring_50m_game OFFSET floor(random()*10000) LIMIT 13;";
			}
			$result = pg_query($this->con, $sql);
			$pic_arr = Array();
			while($row=pg_fetch_array($result)){
				$obj = (object) null;
				$obj -> jpg_name = $row[5];
				$obj -> jpg_direction = $row[6];
				array_push($pic_arr,$obj);
			}
			return $pic_arr;
		}
		
		public function insertRecord($ip='0.0.0.0',$score=0){
			$sql = "INSERT INTO cityscape_join.user_score(ip,score) VALUES ('".(string)$ip."',".(string)$score.")";
			pg_query($this->con, $sql);
		}
	}