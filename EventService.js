const EventService = {
  subscriptions: {},
  subscribe(event, callback) {
    if (!callback) {
      throw new Error('callback is missing from subscribe: ' + event)
    }

    const events = event.split(' ')

    events.forEach(event => {
      event = event.split('.')

      if (!this.subscriptions[event[0]]) {
        this.subscriptions[event[0]] = []
      }

      let eventInfoList = this.subscriptions[event[0]]

      for (let eventInfoItem of eventInfoList) {
        if (eventInfoItem.namespace === event[1]) {
          return
        }
      }

      eventInfoList.push({
        callback,
        namespace: event[1]
      })
    })
  },
  unsubscribe(event) {
    const events = event.split(' ')

    events.forEach(event => {
      event = event.split('.')

      const eventInfoList = this.subscriptions[event[0]]
      if (eventInfoList) {
        for (let [index, eventInfoItem] of eventInfoList.entries()) {
          if (eventInfoItem.namespace === event[1]) {
            eventInfoList.splice(index, 1)
            break
          }
        }

        if (!eventInfoList.length) {
          delete this.subscriptions[event[0]]
        }
      }
    })
  },
  publish(event, data) {
    Object.entries(this.subscriptions).forEach(([eventName, eventInfoList]) => {
      if (eventName === event) {
        eventInfoList.forEach(eventInfoItem => {
          eventInfoItem.callback(data)
        })
      }
    })
  }
}

export default EventService