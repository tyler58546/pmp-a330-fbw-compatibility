class A330_FlightPhase_PreFlight extends A32NX_FlightPhase_PreFlight {
    check(_deltaTime, _fmc) {
        const ra = Simplane.getAltitudeAboveGround() - 5;

        return this.takeoffConfirmation.write(
            // we try to detect a false lift off (during terrain loading) from a true liftoff e.g. during takeoff. (temporary solution only)
            Math.round(ra / 100) !== Math.round(Simplane.getAltitude() / 100) && ra > 1.5 ||
            (
                (
                    Simplane.getEngineThrottleMode(0) >= ThrottleMode.FLEX_MCT ||
                    Simplane.getEngineThrottleMode(1) >= ThrottleMode.FLEX_MCT
                ) &&
                !isNaN(_fmc.v2Speed) &&
                (
                    (
                        SimVar.GetSimVarValue("ENG N1 RPM:1", "percent") > .85 &&
                        SimVar.GetSimVarValue("ENG N1 RPM:2", "percent") > .85
                    ) ||
                    Math.abs(Simplane.getGroundSpeed()) > 80
                )
            ),
            _deltaTime
        );
    }
}
A32NX_FlightPhase_PreFlight = A330_FlightPhase_PreFlight
