from collections import deque, defaultdict

N_FACE = 6

class Cube:
    '''
        cubie's color state, imply position within Rubik too

        relationship between an axis and 6-tuple state of a cubie:
        (state[2*axis], state[2*axis + 1]) is a vector lie on axis in reversed order
    '''
    def __init__(self, colors: list = None):
        '''
        :param colors: valid color value is [1,2,3,4,5,6] else 0
        '''
        if not colors:
            self.state = [0] * N_FACE
        else:
            assert(len(colors) == N_FACE)
            self.state = colors

    def setColor(self, face: int, color: int):
        self.state[face] = color
    def isValid(self):
        return all(map(lambda idx: self.state[idx] != 0 and self.state[idx]+1 == idx, range(N_FACE)))
    def reverseAxis(self, axis: int):
        self.state[2*axis], self.state[2*axis + 1] = self.state[2*axis + 1], self.state[2*axis]
        return self
    def swapAxis(self, i: int, j: int):
        self.state[2*i], self.state[2*j] = self.state[2*j], self.state[2*i]
        self.state[2*i + 1], self.state[2*j + 1] = self.state[2*j + 1], self.state[2*i + 1]
        return self

class Rubik:
    '''
        order of faces: Right (R), Left (L), Up (U), Down (D), Front (F), Back (B)
        lr, du, bf forms an orthogonal basis. Encode as axis 0, 1, 2
    '''
    cubes: dict # mapping from position encoding to Cube
    # define the position encodings that belong to 6 groups RLUDFB,
    # in order of spiral pattern starting from top left corner of the face
    groupMasks: list[list] = [ # TODO: fill in the rest of groupMasks
        [],  # R 0
        [],  # L 1
        [],  # U 2
        [],  # D 3
        [26, 10, 42, 34, 38, 6, 22, 18],  # F 4
        [],  # B 5
    ]
    # index as group, value format (fromAxis, toAxis)
    groupToAxisRotationMap: list = [(2,1), (1,2), (0,2), (2,0), (1,0), (0,1)]

    def __init__(self, cubes=None):
        if cubes:
            self.cubes = cubes
        else:
            # TODO: double check the color
            self.cubes = defaultdict(Cube)
            for group, groupMask in enumerate(self.groupMasks):
                for pos in groupMask:
                    self.cubes[pos].setColor(group, group+1)

    def rotate(self, group):
        '''
        :param group:
            0: bf -> du = 2 -> 1
            1: du -> bf = 1 -> 2
            2: lr -> bf = 0 -> 2
            3: bf -> lr = 2 -> 0
            4: du -> lr = 1 -> 0
            5: lr -> du = 0 -> 1
        :return:
        '''
        face = list(map(lambda pos: (pos, self.cubes[pos]), self.groupMasks[group]))
        fromAxis, toAxis = self.groupToAxisRotationMap[group]
        new_face = self._rotate(face, fromAxis, toAxis)
        for pos, cubie in new_face:
            self.cubes[pos] = cubie
        return self

    def _rotate(self, face, fromAxis, toAxis):
        shifted_face = deque([v[1] for v in face])
        shifted_face.rotate(2)
        for cube in shifted_face:
            cube.reverseAxis(toAxis).swapAxis(fromAxis, toAxis)
        return [(v[0], shifted_face[idx]) for idx, v in enumerate(face)]

if __name__ == '__main__':
    pass

