package model

// Package model defines Go structs for Zhu, Gong, and Pan so the rest of the system
// can share a consistent typed representation of the 奇门 chart.

// Info mirrors qimen.pan.info and carries a localized label plus the underlying value.
type Info struct {
	Label string `json:"label"`
	Value any    `json:"value"`
}

// Pan ports qimen.pan.Pan and wraps every chart attribute in an Info struct.
type Pan struct {
	JieQi     Info `json:"jieQi"`
	NianZhu   Info `json:"nianZhu"`
	YueZhu    Info `json:"yueZhu"`
	RiZhu     Info `json:"riZhu"`
	ShiZhu    Info `json:"shiZhu"`
	YinYang   Info `json:"yinYang"`
	KongWang  Info `json:"kongWang"`
	Yuan      Info `json:"yuan"`
	XunShou   Info `json:"xunShou"`
	JuShu     Info `json:"juShu"`
	DiPan     Info `json:"diPan"`
	TianPan   Info `json:"tianPan"`
	JiuXing   Info `json:"jiuXing"`
	BaShen    Info `json:"baShen"`
	ZhiShiMen Info `json:"zhiShiMen"`
	BaMen     Info `json:"baMen"`
}
