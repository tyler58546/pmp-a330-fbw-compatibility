class A330_FMCMainDisplay extends FMCMainDisplay {
    /* The A330 has a higher max cruise altitude than the A320 Neo */
    constructor() {
        super();
        this.maxCruiseFL = 410;
    }
    /* The A330 has a higher max ZFW than the A320 Neo */
    isZFWInRange(zfw) {
        return 35.0 <= zfw && zfw <= 175.0;
    }
}
FMCMainDisplay = A330_FMCMainDisplay;
