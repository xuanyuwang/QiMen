package model

import "qimen/internal/data"

// 四柱
type Zhu struct {
	Gan string
	Zhi string
}

func (z Zhu) String() string {
	return z.Gan + z.Zhi
}

func (z Zhu) GetGan() string {
	for _, cycle := range data.LiuShiJiaZi {
		if z.String() == cycle.XunShou {
			return cycle.Dun
		}
	}
	return z.Gan
}
