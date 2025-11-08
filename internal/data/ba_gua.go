package data

//go:generate stringer -type=BaGua
type BaGua int

const (
	Kan BaGua = iota + 1
	Kun
	Zhen
	Xun
	Zhong
	Qian
	Dui
	Gen
	Li
)
