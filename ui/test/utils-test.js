
import { List } from 'immutable'
import * as utils from '../src/utils.js'

const mocha = require('mocha');
const assert = require('chai').assert;

describe('Point util tests', function () {

  // @flow
  const points: List<P> = List([
    {
      id: 1,
      tm: 0,
      lng: 1,
      lat: 2,
    },
    {
      id: 2,
      tm: 10,
      lng: 3,
      lat: 4,
    },
    {
      id: 5,
      tm: 5,
      lng: 5,
      lat: 6,
    }
  ])

  const paths = List([
    {
      leftPointId: 1,
      rightPointId: 5,
      points: List([
          {
            lng: 1,
            lat: 2,
          },
          {
            lng: 3,
            lat: 4,
          }
      ])
    },
    {
        leftPointId: 5,
        rightPointId: 2,
        points: List([
            {
              lng: 1,
              lat: 2,
            },
            {
              lng: 3,
              lat: 4,
            }
        ])
      },
  ])

  it('check ID generation', () => {
    assert.equal(utils.getNextId(points), 6);
    assert.equal(utils.getNextId(List([])), 0);
  })
  
  it('should return adjacent points', () => {
    assert.deepEqual(utils.getAdjacentPointsById(points, 5), { 
        left: { 
            id: 1, 
            tm: 0,
            lng: 1,
            lat: 2,
        }, 
        right: { 
            id: 2,
            tm: 10,
            lng: 3,
            lat: 4,
        } 
    });

    assert.deepEqual(utils.getAdjacentPointsById(points, 1),  { 
        left: null, 
        right: { 
            id: 5,
            tm: 5,
            lng: 5,
            lat: 6,
        } 
    });

    assert.deepEqual(utils.getAdjacentPointsById(points, 2),  { 
        left: { 
            id: 5,
            tm: 5,
            lng: 5,
            lat: 6,
        },
        right: null
    });

    assert.deepEqual(utils.getAdjacentPointsById(points, 11111),  { 
        left: null,
        right: null
    });
  })

  it('should add point to the middle', async () => {
    const res = await utils.addPoint(
      points, 
      paths, 
      {
        id: 6,
        tm: 2,
        lng: 7,
        lat: 8,
      }, 
      utils.simpleRouter
    )

    assert.deepEqual(res.points.toArray(),  [ 
        { id: 1, tm: 0, lng: 1, lat: 2 },
        { id: 6, tm: 2, lng: 7, lat: 8 },
        { id: 5, tm: 5, lng: 5, lat: 6 },
        { id: 2, tm: 10, lng: 3, lat: 4 }
    ]);

    assert(res.paths.size == 3)
  })

  it('should add point to the begining', async () => {
    const res = await utils.addPoint(
      points, 
      paths, 
      {
        id: 6,
        tm: -1,
        lng: 7,
        lat: 8,
      }
    )
    assert(res.paths.size == 3)
  })

  it('should add point to the end', async () => {
    const res = await utils.addPoint(
      points, 
      paths, 
      {
        id: 6,
        tm: 100,
        lng: 7,
        lat: 8,
      }
    )
    assert(res.paths.size == 3)
  })

  it('should add point to the empty point list', async () => {
    const res = await utils.addPoint(
      List([]), 
      List([]), 
      {
        id: 6,
        tm: 100,
        lng: 7,
        lat: 8,
      }
    )
    assert(res.points.size == 1)
    assert(res.paths.size == 0)
  })

  it('should remove points from middle', async () => {
    const res = await utils.removePoint(points, paths, 5)
//    console.log(res.paths.toArray())

    assert(res.paths.size == 1)
    assert(res.paths.toArray()[0].leftPointId == 1)
    assert(res.paths.toArray()[0].rightPointId == 2)
    assert(res.points.size == 2)
    assert(res.points.toArray()[0].id == 1)
    assert(res.points.toArray()[1].id == 2)
  })

  it('should remove points from the begining', async () => {
    const res = await utils.removePoint(points, paths, 1)

    assert(res.paths.size == 1)
    assert(res.paths.toArray()[0].leftPointId == 5)
    assert(res.paths.toArray()[0].rightPointId == 2)
    assert(res.points.size == 2)
    assert(res.points.toArray()[0].id == 5)
    assert(res.points.toArray()[1].id == 2)
  })

  it('should remove points from the end', async () => {
    const res = await utils.removePoint(points, paths, 2)

    assert(res.paths.size == 1)
    assert(res.paths.toArray()[0].leftPointId == 1)
    assert(res.paths.toArray()[0].rightPointId == 5)
    assert(res.points.size == 2)
    assert(res.points.toArray()[0].id == 1)
    assert(res.points.toArray()[1].id == 5)
  })

  it('should devide polyline by proportions - v0', () => {
    const res = utils.splitPolyline(0.6, List([
      {
        lng: 0,
        lat: 1,
      },
      {
        lng: 1,
        lat: 2,
      }
    ]))

    assert.deepEqual(res.leftPath.toArray(), [ { lng: 0, lat: 1 }, { lng: 0.6, lat: 1.6 } ]);
    assert.deepEqual(res.rightPath.toArray(), [ { lng: 0.6, lat: 1.6 }, { lng: 1, lat: 2 } ]);
  })

  it('should devide polyline by proportions - v1', () => {
    const res = utils.splitPolyline(0.6, List([
      {
        lng: 1,
        lat: 2,
      },
      {
        lng: 3,
        lat: 5,
      }
    ]))

    assert.deepEqual(res.leftPath.toArray(), [ { lng: 1, lat: 2 }, { lng: 2.2, lat: 3.8 } ]);
    assert.deepEqual(res.rightPath.toArray(), [ { lng: 2.2, lat: 3.8 }, { lng: 3, lat: 5 } ]);
  })

  it('should devide polyline by proportions - v2', () => {
    const res = utils.splitPolyline(0.9, List([
      {
        lng: 0,
        lat: 0,
      },
      {
        lng: 1,
        lat: 2,
      },
      {
        lng: 3,
        lat: 5,
      }
    ]))

    assert.deepEqual(res.leftPath.toArray(), [ 
      { lng: 0, lat: 0 },
      { lng: 1, lat: 2 },
      { lng: 2.7, lat: 4.5 } 
    ]);
    assert.deepEqual(res.rightPath.toArray(), [ { lng: 2.7, lat: 4.5 }, { lng: 3, lat: 5 } ]);
  })

  it('should devide polyline by proportions - v3', () => {
    const res = utils.splitPolyline(0.0, List([
      {
        lng: 0,
        lat: 0,
      },
      {
        lng: 1,
        lat: 2,
      },
      {
        lng: 3,
        lat: 5,
      }
    ]))
    assert.deepEqual(res.leftPath.toArray(), [ { lng: 0, lat: 0 }, { lng: 0, lat: 0 } ]);
    assert.deepEqual(res.rightPath.toArray(), [ { lng: 0, lat: 0 }, { lng: 1, lat: 2 }, { lng: 3, lat: 5 } ]);
  })

  it('should devide polyline by proportions - v4', () => {
    const res = utils.splitPolyline(0.5, List([
      {
        lng: 0,
        lat: 0,
      },
      {
        lng: 1,
        lat: 1,
      },
      {
        lng: 2,
        lat: 2,
      },
      {
        lng: 3,
        lat: 3,
      },
      {
        lng: 4,
        lat: 4,
      },
      {
        lng: 5,
        lat: 5,
      },
      {
        lng: 6,
        lat: 6,
      },
      {
        lng: 7,
        lat: 7,
      }
    ]))
    console.log(res.leftPath.toArray())
    console.log(res.rightPath.toArray())
    assert.deepEqual(res.leftPath.toArray(), [ { lng: 0, lat: 0 }, { lng: 0, lat: 0 } ]);
    assert.deepEqual(res.rightPath.toArray(), [ { lng: 0, lat: 0 }, { lng: 1, lat: 2 }, { lng: 3, lat: 5 } ]);
  })

  it('should split pathes by time', () => {
    const res = utils.splitPathes(2, points, paths)
    
    assert.deepEqual(res.left.toArray(), [ { lng: 1, lat: 2 }, { lng: 1.8, lat: 2.8 } ]);
    assert.deepEqual(res.right.toArray(), [ 
      { lng: 1.8, lat: 2.8 },
      { lng: 3, lat: 4 },
      { lng: 1, lat: 2 },
      { lng: 3, lat: 4 } 
    ]);
  })

  it('should split pathes by time - v2 (out of the range of time)', () => {
    const res = utils.splitPathes(-1, points, paths)
  })
});
