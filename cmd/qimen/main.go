package main

import (
	"fmt"
	"os"
)

// run wires CLI flags to the chart builder.
func run() error {
	// Placeholder CLI until the Go port is implemented.
	fmt.Println("QiMen Go CLI scaffold ready. Implementation pending.")
	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "qimen: %v\n", err)
		os.Exit(1)
	}
}

