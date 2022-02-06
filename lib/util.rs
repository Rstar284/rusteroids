pub struct Timer(f64);

impl Timer {
    pub fn new(duration: f64) -> Self {
        Timer(duration.max(0.0))
    }

    pub fn step(&mut self, dt: f64) -> () {
        self.0 -= dt;
    }

    pub fn remaining(&self) -> f64 {
        self.0
    }

    pub fn is_elapsed(&self) -> bool {
        self.0 <= 0.0
    }
}

pub struct Interval {
    period: f64,
    t: f64,
}

impl Interval {
    pub fn new(period: f64, t: f64) -> Self {
        Interval {
            period: period.max(0.0),
            t: t.max(0.0),
        }
    }

    pub fn step(&mut self, dt: f64) -> () {
        self.t += dt;
    }
}

impl Iterator for Interval {
    type Item = f64;

    fn next(&mut self) -> Option<f64> {
        if self.period <= self.t {
            self.t -= self.period;
            Some(self.t)
        } else {
            None
        }
    }
}
