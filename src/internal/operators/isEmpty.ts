import { Operator } from '../Operator';
import { Subscriber } from '../Subscriber';
import { Observable } from '../Observable';
import { OperatorFunction } from '../types';

/**
 * Emits false if the input observable emits any values, or emits true if the
 * input observable completes without emitting any values.
 *
 * <span class="informal">Tells whether any values are emitted by an observable</span>
 *
 * ![](isEmpty.png)
 *
 * `isEmpty` transforms an Observable that emits values into an Observable that
 * emits a single boolean value representing whether or not any values were
 * emitted by the source Observable. As soon as the source Observable emits a
 * value, `isEmpty` will emit a `false` and complete.  If the source Observable
 * completes having not emitted anything, `isEmpty` will emit a `true` and
 * complete.
 *
 * A similar effect could be achieved with {@link count}, but `isEmpty` can emit
 * a `false` value sooner.
 *
 * ## Examples
 *
 * Emit `false` for a non-empty Observable
 * ```javascript
 * import { Subject } from 'rxjs';
 * import { isEmpty } from 'rxjs/operators';
 *
 * const source = new Subject<string>();
 * const result = source.pipe(isEmpty());
 * source.subscribe(x => console.log(x));
 * result.subscribe(x => console.log(x));
 * source.next('a');
 * source.next('b');
 * source.next('c');
 * source.complete();
 *
 * // Results in:
 * // a
 * // false
 * // b
 * // c
 * ```
 *
 * Emit `true` for an empty Observable
 * ```javascript
 * import { EMPTY } from 'rxjs';
 * import { isEmpty } from 'rxjs/operators';
 *
 * const result = EMPTY.pipe(isEmpty());
 * result.subscribe(x => console.log(x));
 * // Results in:
 * // true
 * ```
 *
 * @see {@link count}
 * @see {@link EMPTY}
 *
 * @return {OperatorFunction<T, boolean>} An Observable of a boolean value indicating whether observable was empty or not
 * @method isEmpty
 * @owner Observable
 */

export function isEmpty<T>(): OperatorFunction<T, boolean> {
  return (source: Observable<T>) => source.lift(new IsEmptyOperator());
}

class IsEmptyOperator implements Operator<any, boolean> {
  call (observer: Subscriber<boolean>, source: any): any {
    return source.subscribe(new IsEmptySubscriber(observer));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class IsEmptySubscriber extends Subscriber<any> {
  constructor(destination: Subscriber<boolean>) {
    super(destination);
  }

  private notifyComplete(isEmpty: boolean): void {
    const destination = this.destination;

    destination.next(isEmpty);
    destination.complete();
  }

  protected _next(value: boolean) {
    this.notifyComplete(false);
  }

  protected _complete() {
    this.notifyComplete(true);
  }
}
