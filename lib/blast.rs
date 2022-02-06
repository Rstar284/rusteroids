use crate::util::Timer;
use std::iter;

const MAX_DISTANCE: f64 = 1200.0;
const MASS: f64 = 200.0;

pub struct Blast {
    expiration: Timer,
    dt: f64,
}
