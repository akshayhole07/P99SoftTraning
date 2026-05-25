# write test for ex.py
import unittest
from ex import addTwoNumbers, returnSquare
class TestAddTwoNumbers(unittest.TestCase):
    def test_addTwoNumbers(self):
        self.assertEqual(addTwoNumbers(2, 3), {"result": 5})
        self.assertEqual(addTwoNumbers(-1, 1), {"result": 0})
        self.assertEqual(addTwoNumbers(0, 0), {"result": 0})

    def test_returnSquare(self):
        self.assertEqual(returnSquare(4), {"result": 16})
        self.assertEqual(returnSquare(-2), {"result": 4})
        self.assertEqual(returnSquare(0), {"result": 1})

if __name__ == '__main__':    
 unittest.main()


# python -m unittest test.__init__

   