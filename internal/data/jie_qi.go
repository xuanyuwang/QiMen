package data

// Package data hosts immutable domain tables such as the JieQi graph, JiaZi mappings,
// and palace definitions translated from the Python codebase.

// JieQiGraph ports qimen/jie_qi_graph.JieQiGraph.
func JieQiToJuShu(jieQi string) [3]int {
	var JieQiGraph = map[string][3]int{
		"立春": {8, 5, 2},
		"雨水": {9, 6, 3},
		"惊蛰": {1, 7, 4},
		"春分": {3, 9, 6},
		"清明": {4, 1, 7},
		"谷雨": {5, 2, 8},
		"立夏": {4, 1, 7},
		"小满": {5, 2, 8},
		"芒种": {6, 3, 9},
		"夏至": {9, 3, 6},
		"小暑": {8, 2, 5},
		"大暑": {7, 1, 4},
		"立秋": {2, 5, 8},
		"处暑": {1, 4, 7},
		"白露": {9, 3, 6},
		"秋分": {7, 1, 4},
		"寒露": {6, 9, 3},
		"霜降": {5, 8, 2},
		"立冬": {6, 9, 3},
		"小雪": {5, 8, 2},
		"大雪": {4, 7, 1},
		"冬至": {1, 7, 4},
		"小寒": {2, 8, 5},
		"大寒": {3, 9, 6},
	}
	return JieQiGraph[jieQi]
}

// JieQiYinYang retains the original yin/yang groupings for each solar term.
func JieQiToYinYang(jieQi string) string {
	var JieQiYinYang = map[string][]string{
		"阳": {"立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "冬至", "小寒", "大寒"},
		"阴": {"夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪"},
	}
	for yinYang, terms := range JieQiYinYang {
		for _, term := range terms {
			if term == jieQi {
				return yinYang
			}
		}
	}
	return ""
}
