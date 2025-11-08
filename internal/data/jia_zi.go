package data

// JiaZiCycle mirrors qimen/JiaZi.py and qimen/jia_zi_graph.py entries.
type JiaZiCycle struct {
	XunShou   string
	ShangYuan []string
	ZhongYuan []string
	XiaYuan   []string
	KongWang  []string
	Dun       string
}

// LiuShiJiaZi replicates the sixty JiaZi cycle groupings.
var LiuShiJiaZi = []JiaZiCycle{
	{
		XunShou:   "甲子",
		ShangYuan: []string{"甲子", "乙丑", "丙寅", "丁卯", "戊辰"},
		ZhongYuan: []string{"己巳", "庚午", "辛未", "壬申", "癸酉"},
		KongWang:  []string{"戌", "亥"},
		Dun:       "戊",
	},
	{
		XunShou:   "甲戌",
		ShangYuan: []string{"己卯", "庚辰", "辛巳", "壬午", "癸未"},
		XiaYuan:   []string{"甲戌", "乙亥", "丙子", "丁丑", "戊寅"},
		KongWang:  []string{"申", "酉"},
		Dun:       "己",
	},
	{
		XunShou:   "甲申",
		ZhongYuan: []string{"甲申", "乙酉", "丙戌", "丁亥", "戊子"},
		XiaYuan:   []string{"己丑", "庚寅", "辛卯", "壬辰", "癸巳"},
		KongWang:  []string{"午", "未"},
		Dun:       "庚",
	},
	{
		XunShou:   "甲午",
		ShangYuan: []string{"甲午", "乙未", "丙申", "丁酉", "戊戌"},
		ZhongYuan: []string{"己亥", "庚子", "辛丑", "壬寅", "癸卯"},
		KongWang:  []string{"辰", "巳"},
		Dun:       "辛",
	},
	{
		XunShou:   "甲辰",
		ShangYuan: []string{"己酉", "庚戌", "辛亥", "壬子", "癸丑"},
		XiaYuan:   []string{"甲辰", "乙巳", "丙午", "丁未", "戊申"},
		KongWang:  []string{"寅", "卯"},
		Dun:       "壬",
	},
	{
		XunShou:   "甲寅",
		ZhongYuan: []string{"甲寅", "乙卯", "丙辰", "丁巳", "戊午"},
		XiaYuan:   []string{"己未", "庚申", "辛酉", "壬戌", "癸亥"},
		KongWang:  []string{"子", "丑"},
		Dun:       "癸",
	},
}
