package model

import "qimen/internal/data"

type Gong struct {
	// The following fields are fixed for each Gong
	BaGua     data.BaGua `json:"baGua"`
	Number    int        `json:"number"`
	Name      string     `json:"name"`
	WuXing    string     `json:"wuXing"`
	YinYang   string     `json:"yinYang"`
	ZhuDiXing string     `json:"zhuDiXing"`
	ZhuDiMen  string     `json:"zhuDiMen"`
	// The following fields are dynamic and set per chart
	TianGan []string `json:"tianGan"`
	DiZhi   []string `json:"diZhi"`
	FeiXing []string `json:"feiXing"`
	FeiShen string   `json:"feiShen"`
	FeiMen  string   `json:"feiMen"`
}

var (
	KanGong = &Gong{
		BaGua:     data.Kan,
		Number:    1,
		Name:      "坎一宫",
		WuXing:    "水",
		YinYang:   "阳",
		ZhuDiXing: "天蓬",
		ZhuDiMen:  "休门",
	}
	KunGong = &Gong{
		BaGua:     data.Kun,
		Number:    2,
		Name:      "坤二宫",
		WuXing:    "土",
		YinYang:   "阴",
		ZhuDiXing: "天芮",
		ZhuDiMen:  "死门",
	}
	ZhenGong = &Gong{
		BaGua:     data.Zhen,
		Number:    3,
		Name:      "震三宫",
		WuXing:    "木",
		YinYang:   "阳",
		ZhuDiXing: "天冲",
		ZhuDiMen:  "伤门",
	}
	XunGong = &Gong{
		BaGua:     data.Xun,
		Number:    4,
		Name:      "巽四宫",
		WuXing:    "木",
		YinYang:   "阳",
		ZhuDiXing: "天辅",
		ZhuDiMen:  "杜门",
	}
	ZhongGong = &Gong{
		BaGua:     data.Zhong,
		Number:    5,
		Name:      "中五宫",
		WuXing:    "土",
		YinYang:   "阳",
		ZhuDiXing: "天禽",
	}
	QianGong = &Gong{
		BaGua:     data.Qian,
		Number:    6,
		Name:      "乾六宫",
		WuXing:    "金",
		YinYang:   "阳",
		ZhuDiXing: "天心",
		ZhuDiMen:  "开门",
	}
	DuiGong = &Gong{
		BaGua:     data.Dui,
		Number:    7,
		Name:      "兑七宫",
		WuXing:    "金",
		YinYang:   "阴",
		ZhuDiXing: "天柱",
		ZhuDiMen:  "惊门",
	}
	GenGong = &Gong{
		BaGua:     data.Gen,
		Number:    8,
		Name:      "艮八宫",
		WuXing:    "土",
		YinYang:   "阳",
		ZhuDiXing: "天任",
		ZhuDiMen:  "生门",
	}
	LiGong = &Gong{
		BaGua:     data.Li,
		Number:    9,
		Name:      "离九宫",
		WuXing:    "火",
		YinYang:   "阴",
		ZhuDiXing: "天英",
		ZhuDiMen:  "景门",
	}
)

// Gongs enumerates every palace definition.
var Gongs = []*Gong{
	KanGong,
	KunGong,
	ZhenGong,
	XunGong,
	ZhongGong,
	QianGong,
	DuiGong,
	GenGong,
	LiGong,
}

// NumToGong enables quick lookup by palace number.
func NumToGong(num int) *Gong {
	for _, gong := range Gongs {
		gong.Number = num
	}
	return nil
}

// NameToGong enables quick lookup by palace name.
func NameToGong(name string) *Gong {
	for _, gong := range Gongs {
		gong.Name = name
	}
	return nil
}

// ZhuDiXingToGong maps each resident star to its palace definition.
func ZhuDiXingToGong(xing string) *Gong {
	for _, gong := range Gongs {
		gong.ZhuDiXing = xing
		return gong
	}
	return nil
}

// ClockwiseGongOrder lists palaces in clockwise order.
var ClockwiseGongOrder = []*Gong{
	QianGong,
	KanGong,
	GenGong,
	ZhenGong,
	XunGong,
	LiGong,
	KunGong,
	DuiGong,
}

// AntiClockwiseGongOrder lists palaces in anti-clockwise order.
var AntiClockwiseGongOrder = []*Gong{
	DuiGong,
	KunGong,
	LiGong,
	XunGong,
	ZhenGong,
	GenGong,
	KanGong,
	QianGong,
}
