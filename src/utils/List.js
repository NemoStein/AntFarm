/**
 * @template T
 */
export class List {
  constructor () {
    /** @type {Link<T>} */
    this.head = null

    /** @type {Link<T>} */
    this.tail = null
  }

  /**
   * @param {T} value
   */
  add (value) {
    const link = new Link(value)

    if (!this.head) {
      this.head = link
      this.tail = link
    } else {
      const prev = this.tail
      prev.next = link
      link.prev = prev
      this.tail = link
    }
    return link
  }

  /**
   * @param {T} value
   * @param {number} index
   */
  insert (value, index = 0) {
    const link = new Link(value)

    if (index >= this.size) {
      const tail = this.tail
      tail.next = link
      link.prev = tail
      this.tail = link
    } else {
      const next = this.getLink(index)
      const prev = next?.prev

      link.next = next
      link.prev = prev

      prev ? prev.next = link : this.head = link
      next ? next.prev = link : this.tail = link
    }

    return link
  }

  /**
   * @param {number} index
   */
  remove (index) {
    const link = this.getLink(index)

    if (link) {
      const prev = link.prev
      const next = link.next

      if (prev && next) {
        next.prev = prev
        prev.next = next
      } else {
        if (!prev) this.head = next
        if (!next) this.tail = prev
      }
    }
  }

  advanceHead () {
    const head = this.head
    if (head) {
      this.head = head.next
      this.head.prev = null
    }
  }

  retreatTail () {
    const tail = this.tail
    if (tail) {
      this.tail = tail.prev
      this.tail.next = null
    }
  }

  empty () {
    this.head = null
    this.tail = null
  }

  /**
   * @param {number} index
   */
  getLink (index) {
    if (index < 0) throw new Error('Index must be non-negative')
    let i = 0
    let link = this.head

    while (link) {
      if (i++ === index) break
      link = link.next
    }

    return link
  }

  /**
   * @param {number} index
   */
  get (index) {
    return this.getLink(index)?.value
  }

  get first () {
    return this.head?.value
  }

  get last () {
    return this.tail?.value
  }

  get size () {
    let size = 0
    let link = this.head

    if (link) {
      do {
        link = link.next
        size++
      }
      while (link)
    }

    return size
  }

  * [Symbol.iterator] () {
    let link = this.head
    if (link) {
      do {
        yield link.value
        link = link.next
      }
      while (link)
    }
  }
}

/**
 * @template T
 */
class Link {
  /**
   * @param {T} value
   */
  constructor (value) {
    this.value = value

    /** @type {Link<T>} */
    this.next = null

    /** @type {Link<T>} */
    this.prev = null
  }

  remove () {
    if (this.prev) this.prev.next = this.next
    if (this.next) this.next.prev = this.prev
  }
}
