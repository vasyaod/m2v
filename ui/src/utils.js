// @flow
import { List } from 'immutable'
import * as osm from './osm.js'

type Point = { 
  id: number,
  tm: number,
  lng: number,
  lat: number,
  pathType: string,
};

/**
 * Returns next ID from point list. This is nessosary for generation of
 * a new ID.
 */
export function getNextId(points) {
  const max = points.maxBy(x => x.id)
  return (max == null ? 0 : max.id + 1)
}

export function getNextTime(points) {
  const max = points.maxBy(x => x.tm)
  return (max == null ? 0 : max.tm + 60)
}

/**
 * Returns max time value for points.
 */
export function maxTime(points) {
  const max = points.maxBy(x => x.tm)
  return (max == null ? 0 : max.tm)
}

/**
 * Return a point by it's ID 
 */
export function pointById(pointId: number, points: List<Point>): Point {
  return points.find(p => p.id == pointId)
}

/**
 * Returns the closest point to another point
 */
export function closestPoint(point, points) {
  return points.minBy(x => {
    var line = new ol.geom.LineString([[point.lng, point.lat],[x.lng, x.lat]]);
    return line.getLength()
  })
}

/**
 * Returns the closest paths to some point
 */
export function closestPaths(point, paths) {
  return paths.minBy( p => {
    const linePoints = p.points.map(x => [x.lng, x.lat]).toArray()
    var line = new ol.geom.LineString(linePoints);
    return line.getLength()
  })
}

/**
 * Returns adjacent points in timeline. Adjacent points are the closest points by time 
 * mesure
 */
export function getAdjacentPoints(points, point) {
  const rightPoints = points.filter(x => point.tm < x.tm)
  const leftPoints = points.filter(x => point.tm > x.tm)
  
  const rightPoint = rightPoints.minBy(x => x.tm)
  const leftPoint = leftPoints.maxBy(x => x.tm)
  return {
    left: leftPoint, 
    right: rightPoint
  }
}

/**
 * Returns adjacent points in timeline. Adjacent points are the closest points by time 
 * mesure
 */
export function getAdjacentPointsById(points, pointId) {
  const point = points.find(x => x.id == pointId)
  if (point == null)
    return {
      left: null, 
      right: null
    }
  const rightPoints = points.filter(x => point.tm < x.tm)
  const leftPoints = points.filter(x => point.tm > x.tm)
  
  const rightPoint = rightPoints.minBy(x => x.tm)
  const leftPoint = leftPoints.maxBy(x => x.tm)
  return {
    left: leftPoint == null ? null : leftPoint, 
    right: rightPoint == null ? null : rightPoint
  }
}

/**
 * Build a siple line from first point to second.
 */
export const simplePath = async (point1, point2) => {
  return List([point1, point2])
}

const pathFactory = (type) => {
  if(type == "line")
    return simplePath
  if(type == "route")
    return osm.router

  return simplePath
}


export const addPoint = async (points, paths, point) => {
  point.id = getNextId(points)
  if(point.tm == -1) {
    point.tm = getNextTime(points)
  }

  const adjacentPoints = getAdjacentPoints(points, point)
  let newPaths
  if (adjacentPoints.left != null && adjacentPoints.right != null) {
    const router1 = pathFactory(adjacentPoints.left.pathType)
    const router2 = pathFactory(point.pathType)
    newPaths = paths
      .filter(x => !(x.leftPointId == adjacentPoints.left.id && x.rightPointId == adjacentPoints.right.id))
      .push({
          leftPointId: adjacentPoints.left.id,
          rightPointId: point.id,
          points: await router1(adjacentPoints.left, point)
        }, {
          leftPointId: point.id,
          rightPointId: adjacentPoints.right.id,
          points: await router2(point, adjacentPoints.right)
        })
  } else if (adjacentPoints.left != null) {
    const router = pathFactory(adjacentPoints.left.pathType)
    newPaths = paths
      .push({
          leftPointId: adjacentPoints.left.id,
          rightPointId: point.id,
          points: await router(adjacentPoints.left, point)
        })
  } else if (adjacentPoints.right != null) {
    const router = pathFactory(point.pathType)
    newPaths = paths
      .push({
        leftPointId: point.id,
        rightPointId: adjacentPoints.right.id,
        points: await router(point, adjacentPoints.right)
      })
  } else {
    newPaths = paths
  }

  return {
    points: points.push(point).sortBy(x => x.tm),
    paths: newPaths
  }
}

export const removePoint = async (points, paths, pointId) => {
  const point = points.find(x => x.id == pointId)
  const adjacentPoints = getAdjacentPoints(points, point)
  let newPaths = paths.filter(x => x.leftPointId != pointId && x.rightPointId != pointId)
  
  if (adjacentPoints.left != null && adjacentPoints.right != null) {
    const router = pathFactory(adjacentPoints.left.pathType)
    newPaths = newPaths
      .push({
          leftPointId: adjacentPoints.left.id,
          rightPointId: adjacentPoints.right.id,
          points: await router(adjacentPoints.left, adjacentPoints.right)
        })
  }
  return {
    points: points.filter(x => x.id != pointId).sortBy(x => x.tm),
    paths: newPaths
  }
}

export const dist1 = (p1, p2) => {
  //return Math.sqrt(Math.pow(p1.lng - p2.lng, 2) + Math.pow(p1.lan - p2.lan, 2))
  var line = new ol.geom.LineString([[p1.lng, p1.lat],[p2.lng, p2.lat]]);
  return line.getLength()
}

/**
 * Devide a polyline which is represented by `simplePoints` on two side left and fight
 */
export function splitPolyline(factor, simplePoints, distFunc) {
  const pairs = simplePoints.butLast().zip(simplePoints.rest())
  const sumDistance = pairs.map(x => distFunc(x[1], x[0])).reduce((prev, current) => prev + current)
  
  return pairs.reduce((acc, x) => {
    const dist = distFunc(x[1], x[0])
    let leftPointOpt = List([])
    let rightPointOpt = List([])
    if (sumDistance * factor > acc.sumDist + dist) {
      leftPointOpt = List([x[0]])
      rightPointOpt = List([])
    } else if(acc.sumDist <= sumDistance * factor && acc.sumDist + dist > sumDistance * factor) {
      const distanceRemind = (sumDistance * factor - acc.sumDist) / dist

      const midlePoint = {
        lng: x[0].lng + (x[1].lng - x[0].lng) * distanceRemind,
        lat: x[0].lat + (x[1].lat - x[0].lat) * distanceRemind
      }
      leftPointOpt = List([x[0], midlePoint])
      rightPointOpt = List([midlePoint, x[1]])
    } else {
      leftPointOpt = List([])
      rightPointOpt = List([x[1]])
    }

    return {
      sumDist: acc.sumDist + dist,
      leftPath: acc.leftPath.concat(leftPointOpt),
      rightPath: acc.rightPath.concat(rightPointOpt)
    }
  }, {
    sumDist: 0,
    leftPath: List([]),
    rightPath: List([])
  })
}

export function splitPathes(time, points, _paths, distFunc) {
  const paths = _paths.sortBy(path => points.find(p => p.id == path.leftPointId).tm)
  //const time = time1 + 2
  const current = paths.find(path => {
    const leftPoint = points.find(p => p.id == path.leftPointId)
    const rightPoint = points.find(p => p.id == path.rightPointId)
    return leftPoint.tm <= time && rightPoint.tm > time
  })

  const leftPathes = paths.filter(path => {
    const rightPoint = points.find(p => p.id == path.rightPointId)
    return rightPoint.tm <= time
  })

  const rightPathes = paths.filter(path => {
    const leftPoint = points.find(p => p.id == path.leftPointId)
    return leftPoint.tm > time
  })

  if (current == null) {
    return {
      left: leftPathes.flatMap(x => x.points),
      right: rightPathes.flatMap(x => x.points)
    }
  } else {
    const leftPoint = points.find(p => p.id == current.leftPointId)
    const rightPoint = points.find(p => p.id == current.rightPointId)
    const factor = (time - leftPoint.tm) / (rightPoint.tm - leftPoint.tm)
    const devidedCurrent = splitPolyline(factor, current.points, distFunc)
    return {
      left: leftPathes.flatMap(x => x.points).concat(devidedCurrent.leftPath),
      right: devidedCurrent.rightPath.concat(rightPathes.flatMap(x => x.points))
    }
  }
}
