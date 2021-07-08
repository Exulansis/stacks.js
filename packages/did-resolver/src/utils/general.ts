import { StacksNetwork } from "@stacks/network"
import { FutureInstance, reject, resolve } from "fluture"
import { Either, Left, Right } from "monet"

export const stripHexPrefixIfPresent = (data: string) => {
  if (data.startsWith("0x")) return data.substr(2)

  return data
}

export const encodeFQN = (args: {
  name: string
  namespace: string
  subdomain?: string
}) => {
  const { name, subdomain, namespace } = args
  return `${subdomain ? subdomain + "." : ""}${name}.${namespace}`
}

type FQN = {
  name: string
  namespace: string
  subdomain?: string
}

export const decodeFQN = (fqdn: string): Either<Error, FQN> => {
  const nameParts = fqdn.split(".")
  if (nameParts.length < 2) {
    return Left(new Error("Invalid FQN")) // TODO Error Code
  }

  if (nameParts.length === 3) {
    const [subdomain, name, namespace] = nameParts
    return Right({
      subdomain,
      name,
      namespace,
    })
  } else {
    const [name, namespace] = nameParts
    return Right({
      name,
      namespace,
    })
  }
}

export const getApiUrl = (network: StacksNetwork): string => {
  // TODO investigate
  //@ts-ignore The accessor is defined, but not recognized by typescript for some odd reason
  return network.coreApiUrl
}

export const createRejectedFuture = <R, F>(
  rejectWith: R
): FutureInstance<R, F> => {
  return reject(rejectWith) as FutureInstance<R, F>
}

export const eitherToFuture = <L, R>(
  either: Either<L, R>
): FutureInstance<L, R> => {
  return either.fold((v) => createRejectedFuture<L, R>(v), resolve)
}

