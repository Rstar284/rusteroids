pub struct Controls(u32);

impl Controls {
    pub fn new(input: u32) -> Self {
        Controls(input)
    }

    pub fn left(&self) -> bool {
        self.0 & 1 != 0
    }

    pub fn right(&self) -> bool {
        self.0 & 2 != 0
    }

    pub fn thrust(&self) -> bool {
        self.0 & 4 != 0
    }

    pub fn fire(&self) -> bool {
        self.0 & 8 != 0
    }

    pub fn shield(&self) -> bool {
        self.0 & 16 != 0
    }

    pub fn start(&self) -> bool {
        self.0 & 32 != 0
    }
}
