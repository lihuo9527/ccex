export class FixedSizeQueue<T> {
  private inner: T[];
  get Inner() {
    return this.inner;
  }

  constructor(public size, private order: 'ASC' | 'DESC') {
    this.inner = [];
  }

  bulkSet(items: T[]) {
    for (let i = 0; i < this.size; i++) {
      this.inner.push(items[i]);
    }
  }

  get Last() {
    return this.order === 'ASC' ? this.inner[this.inner.length - 1] : this.inner[0];
  }

  enqueue(item: T) {
    if (this.order === 'ASC') {
      if (this.inner.length === this.size) {
        this.inner.shift();
      }
      this.inner.push(item);
    } else {
      if (this.inner.length === this.size) {
        this.inner.pop();
      }
      this.inner.unshift(item);
    }
  }

  remove(item: T) {
    let index = this.inner.indexOf(item);
    this.inner.splice(index, 1);
  }
}