export default abstract class TransitionBase {
   from: string
   to: string

   constructor(from: string, to: string) {
      this.from = from
      this.to = to
   }

   abstract canTransact(condition: string): boolean
}
