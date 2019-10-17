---
title: "What We Got Right When We Built Tania"
date: 2019-10-17T12:38:51+08:00
draft: false
featuredimg: /img/tania-fe.jpg
author: Didiet Noor
---

# What we got right when building Tania

Hi, my name is Didiet, one of the co-founders of Tanibox. Two years ago in 2017, Asep, my co-founder told me that he
wanted to rewrite the software that he has been built to better architecture. He felt that the three-tier architecture
built on top of PHP and Symfony is not flexible enough to meet our business need. We rewrote Tania with **embracing
uncertainty** in mind and I think there are things we got right when building Tania.

## Applying Domain-Driven Design

I think this is the most important thing that makes our software can be evolved over time. Implementing Domain Driven
Design was a blessing for us. When we tried to build Gro, our smart planter, we use **the same exact code** as the
open-source one, we forked it and implemented [Amazon Cognito](https://aws.amazon.com/cognito/) as our authentication
backend. The change is not major and it didn't touch any code other than the code involved in authenticating and
authorising.

Domain-Driven Design also enables the developers to **talk directly to the product manager** to verify three the most
important things: **Behaviours, Rules, and Edge Cases** and write tests based on that without thinking about how we
persist the entities. Focusing on business behaviours makes developers more emphatic to business rules and needs.

![DDD](/img/DDD.png "Domain Driven Design")

**Identifying Domain** was a fun exercise. We interviewed our product owner and then deduce which part of the software
can be built and deployed independently to each other. This helps us to build the *modular monolith* architecture that
able to be scaled to *micro-services* when we ready to scale.

**Ubiquitous Language** helps communications and removes the need for so-called 'translation layer' between product
owner and engineers. We defined vocabularies for each domain and we use the **exact** wording for communication as well
as in the code itself.


In the code, we implement the entities as **rich entities** with behaviours in POGO (Plain Old Go Object).

```go
type Farm struct {
	UID         uuid.UUID 
	Name        string 
	Latitude    string 
	Longitude   string    
	Type        string    
	Country     string    
	City        string    
	IsActive    bool      
	CreatedDate time.Time 
}
```

The structure describes the properties of the farm. It's not an ORM, just a plain object. We also define methods in the
object to reflect its behaviours. We ban the use of **Update** in the method name because it has many semantic meanings
in which it's not easy to be communicated. So we use verbs such as `change`, `increase`, `decrease` in the model to be
able to communicate **what the entity does** more accurately. For example:

```go
func (f *Farm) ChangeName(name string) error {
	err := validateFarmName(name)
	if err != nil {
		return err
	}
	
	f.Name = name
	//.. redacted
}
```

This is an example of the **behaviour**. We name the method as if we're saying "please change the farm name". Inside the
method, there's one validator to validate whether the farm name is correct and return an error when it's not correct.
Let's see the implementation of the validator.

```go
func validateFarmName(name string) error {
	if name == "" {
		return FarmError{FarmErrorNameEmptyCode}
	}
	if !validationhelper.IsAlphanumSpaceHyphenUnderscore(name) {
		return FarmError{FarmErrorNameAlphanumericOnlyCode}
	}
	if len(name) < 5 {
		return FarmError{FarmErrorNameNotEnoughCharacterCode}
	}
	if len(name) > 100 {
		return FarmError{FarmErrorNameExceedMaximunCharacterCode}
	}
	
	return nil
}
```

This validator defines **Rules** in which we can say that farm name:

- Should not be empty.
- Should only consist of alphanumerics, hyphen and underscore.
- Should be more than 5 characters and less than 100 characters.

If those rules aren't satisfied, it'll return an error. These errors are **domain error** not HTTP error nor
infrastructure error. We **don't care** about them when we talk about domain. Let's see how custom errors are
implemented.

```go
// FarmError is a custom error from Go built-in error
type FarmError struct {
	Code int
}

const (
	FarmErrorInvalidFarmTypeCode = iota

	FarmErrorReservoirAlreadyAdded
	FarmErrorReservoirNotFound

	FarmErrorAreaAlreadyAdded
	FarmErrorAreaNotFound

	FarmErrorNameEmptyCode
	FarmErrorNameNotEnoughCharacterCode
	FarmErrorNameExceedMaximunCharacterCode
	FarmErrorNameAlphanumericOnlyCode

	FarmErrorInvalidLatitudeValueCode
	FarmErrorInvalidLongitudeValueCode
	FarmErrorInvalidCountry
	FarmErrorInvalidCity
)

func (e FarmError) Error() string {
	switch e.Code {
	case FarmErrorInvalidFarmTypeCode:
		return "Farm type code value is invalid."
	case FarmErrorReservoirAlreadyAdded:
		return "Reservoir is already added."
	case FarmErrorReservoirNotFound:
		return "Farm reservoir not found."
	case FarmErrorAreaAlreadyAdded:
		return "Area is already added."
	case FarmErrorAreaNotFound:
		return "Farm area not found."
	case FarmErrorNameEmptyCode:
		return "Farm name is required."
	case FarmErrorNameNotEnoughCharacterCode:
		return "Not enough character on farm name"
	case FarmErrorNameExceedMaximunCharacterCode:
		return "Farm name cannot more than 100 characters"
	case FarmErrorNameAlphanumericOnlyCode:
		return "Farm name should be alphanumeric, space, hypen, or underscore"
	case FarmErrorInvalidLatitudeValueCode:
		return "Latitude value is invalid"
	case FarmErrorInvalidLongitudeValueCode:
		return "Longitude value is invalid"
	case FarmErrorInvalidCountry:
		return "Invalid country"
	case FarmErrorInvalidCity:
		return "Invalid city"
	default:
		return "Unrecognized location error code"
	}
}
```

You can see that the error will have its own code and description. It implements `error` interface so it can return a
string that can be used by the upper layer to show the error.

This way, behaviours and rules can be tested with the **edge cases** found during product discovery.


## Implementing Onion/Hexagonal Architecture

With Domain-Driven Design in mind, we implement the software with Hexagonal Architecture. Hexagonal Architecture was
invented by [Alistair Cockburn](https://en.wikipedia.org/wiki/Alistair_Cockburn) with this intent:

> Allow an application to equally be driven by users, programs, automated test or batch scripts, and to be developed and
> tested in isolation from its eventual run-time devices and databases.

It turns out that abstracting making everything as interface helps us a lot on evolving the software. This allows us to
**embrace the uncertainty of technology**. We didn't even decide what database we will use until much-much later. We saw
databases like a *real option*:

> Real Options are options that exist outside of legal frameworks such as tickets.

An option allows us to commit later when we exactly know why. In this case, it's the persistence engine we'd want to use
to persist the entities.

![hexagonal](/img/hexagonal.jpg "Hexagonal Architecture")

Implementing as interfaces make us easily see and digest the code. We can see **what** a particular persistence engine
can do such as: `FindFarmByID()` , `SearchFarmByName()` and we can `Save()` a `Farm` entity to that storage. **How**
it's done is implementation details. Here's an example of the interface of the queries for `Farm`:

```go
type FarmReadQuery interface {
	FindByID(farmUID uuid.UUID) <-chan QueryResult
	FindAll() <-chan QueryResult
}
```

This says that the persistence engine can be queried and will return a channel with the result inside. 

At first, we just implement simple storage based on Golang's in-memory map. Yes, no fancy database at all. Later on,
we're able to persist our entities on Sqlite and MySQL. This makes our implementation is compatible with [Amazon
Aurora](https://aws.amazon.com/rds/aurora/).

We also implement an in-memory simple event bus to be able to send messages from one domain to another. As domains are
implemented totally separated to each other we need an event bus in which each domain can publish and subscribe. The
interface is pretty simple.

```go
type TaniaEventBus interface {
	Publish(eventName string, event interface{})
	Subscribe(eventName string, handlerFunc interface{})
}
```

This interface can be implemented to "real" message broker like Kafka, NATS, or even [Amazon SQS](aws.amazon.com/sqs)
when we decide to make microservices from Tania. At the moment we only use a simple, in-memory event bus like
[here](https://github.com/asaskevich/EventBus).

We still haven't committed yet on what kind of message broker we'll be using because **the option of choosing message
broke hasn't expired yet** as we're still in 'modular monolith' phase.

## Using Go as our development language.

Go was chosen because we want the **easy deployment** of our software. Go produce **single binary** that can be run on
Windows, macOS, and Linux. With the help of [musl](https://www.musl-libc.org/) we can produce a *static binary* that is
self-contained in Linux.

![Golang](/img/golang.png "Go Programming Language")

The choice of Golang makes Tania becomes virtually scalable to any machines that run ARM or Intel chips. Tania can run
on Raspberry Pi to managed container engine like [Amazon Fargate](https://aws.amazon.com/fargate/). Moreover, the
frontend can be deployed as a website on [Amazon S3](https://aws.amazon.com/s3/) because it's just static Javascript
files.

## Conclusion

Tania was built with 'embracing uncertainty' at heart. This allows us to be flexible and implement our software not only
extendable and scalable but also malleable. Implementing Gro backend from Tania backend shows its malleability. 

The fact that Tania can be deployed on a small ARM machine to managed container engine shows that Tania is extendable
and scalable. And because it's deployed as **modular monolith**, it can be transformed to **micro services** with little
effort as every domain is clearly defined.

